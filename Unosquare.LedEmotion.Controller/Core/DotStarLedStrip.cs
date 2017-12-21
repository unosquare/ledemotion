namespace Unosquare.LedEmotion.Controller.Core
{
    using Swan.Formatters;
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using RaspberryIO;
    using RaspberryIO.Gpio;

    /// <summary>
    /// Represents an SPI addressable strip of RGB LEDs
    /// Model number APA102C
    /// This strip is also known as Adafruit DotStar LED strip (just a new name for an existing item)
    /// You can get it here: https://www.adafruit.com/products/2239
    /// or here: https://www.aliexpress.com/wholesale?SearchText=APA102C
    /// </summary>
    public class DotStarLedStrip
    {
        #region Static Declarations

        public static readonly byte[] StartFrame = new byte[4];
        public static readonly byte[] EndFrame = { 0xFF, 0xFF, 0xFF, 0xFF };

        internal const byte BrightnessSetMask = 0xE0;
        internal const byte BrightnessGetMask = 0x1F;

        #endregion

        #region State Variables

        private readonly byte[] _frameBuffer; // Contains what needs to be written over the SPI channel
        private readonly object _syncLock = new object(); // for thread safety
        private readonly SpiChannel _channel; // will be set in the constructor
        private readonly byte[] _clearBuffer; // Contains clear pixel data which is a set of 0xE0 bytes
        private readonly byte[] _pixelHolder = new byte[4]; // used heavily to manipulate pixels
        private readonly Dictionary<int, DotStarLedStripPixel> _pixels = new Dictionary<int, DotStarLedStripPixel>();
        #endregion

        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="DotStarLedStrip"/> class.
        /// </summary>
        /// <param name="ledCount">The length of the stip.</param>
        /// <param name="spiChannel">The SPI channel.</param>
        /// <param name="spiFrequency">The SPI frequency.</param>
        /// <param name="reverseRgb">if set to <c>true</c> colors will be sent to the strip as BGR, otherwise as RGB.</param>
        public DotStarLedStrip(
            int ledCount = 60, 
            int spiChannel = 1, 
            int spiFrequency = SpiChannel.DefaultFrequency,
            bool reverseRgb = true)
        {
            // Basic properties
            LedCount = ledCount;
            ReverseRgb = reverseRgb;

            // Create the frame buffer
            _frameBuffer = new byte[(_pixelHolder.Length * LedCount) + (StartFrame.Length + EndFrame.Length)];
            Buffer.BlockCopy(StartFrame, 0, _frameBuffer, 0, StartFrame.Length);
            Buffer.BlockCopy(EndFrame, 0, _frameBuffer, _frameBuffer.Length - EndFrame.Length, EndFrame.Length);

            // Create ther Clear buffer
            _clearBuffer = new byte[_pixelHolder.Length * LedCount];
            for (var baseAddress = 0; baseAddress < LedCount * _pixelHolder.Length; baseAddress += _pixelHolder.Length)
            {
                Buffer.SetByte(_clearBuffer, baseAddress, BrightnessSetMask);
            }

            if (Debugger.IsAttached == false)
            {
                // Select the SPI channel
                if (spiChannel == 0)
                {
                    Pi.Spi.Channel0Frequency = spiFrequency;
                    _channel = Pi.Spi.Channel0;
                }
                else
                {
                    Pi.Spi.Channel1Frequency = spiFrequency;
                    _channel = Pi.Spi.Channel1;
                }
            }

            // Set all the pixels to no value
            ClearPixels();
            Render();
        }

        #endregion

        #region Properties

        /// <summary>
        /// Gets a value indicating whether RGB values are sent as GBR
        /// This is typically true
        /// </summary>
        public bool ReverseRgb { get; }

        /// <summary>
        /// Gets the LED count.
        /// </summary>
        public int LedCount { get; }

        internal byte[] FrameBuffer => _frameBuffer;

        /// <summary>
        /// Gets the <see cref="DotStarLedStripPixel"/> at the specified index.
        /// </summary>
        /// <value>
        /// The <see cref="DotStarLedStripPixel"/>.
        /// </value>
        /// <param name="index">The index.</param>
        public DotStarLedStripPixel this[int index] => GetPixel(index);

        #endregion

        #region Pixel Methods and Rendering

        /// <summary>
        /// Clears all the pixels. Call the Render method to apply the changes.
        /// </summary>
        public void ClearPixels()
        {
            lock (_syncLock)
            {
                Buffer.BlockCopy(_clearBuffer, 0, FrameBuffer, StartFrame.Length, _clearBuffer.Length);
            }
        }

        /// <summary>
        /// Gets the pixel.
        /// </summary>
        /// <param name="index">The index.</param>
        /// <returns>A pixel</returns>
        public DotStarLedStripPixel GetPixel(int index)
        {
            if (index < 0 || index > LedCount - 1)
                return null;

            lock (_syncLock)
            {
                if (_pixels.ContainsKey(index) == false)
                    _pixels[index] = new DotStarLedStripPixel(this, StartFrame.Length + (index * _pixelHolder.Length));

                return _pixels[index];
            }
        }

        /// <summary>
        /// Sets the pixel brightness, R, G and B at the given index.
        /// And invalid index has no effect
        /// </summary>
        /// <param name="index">The index.</param>
        /// <param name="brightness">The brightness.</param>
        /// <param name="r">The Red.</param>
        /// <param name="g">The Green.</param>
        /// <param name="b">The Blue.</param>
        public void SetPixel(int index, float brightness, byte r, byte g, byte b)
        {
            lock (_syncLock)
            {
                if (index < 0 || index > LedCount - 1)
                    return;

                var pixel = this[index];
                pixel.R = r;
                pixel.G = g;
                pixel.B = b;
                pixel.Brightness = brightness;
            }
        }

        /// <summary>
        /// Sets all the LED strip pixels to a single color, at full brightness.
        /// </summary>
        /// <param name="r">The r.</param>
        /// <param name="g">The g.</param>
        /// <param name="b">The b.</param>
        public void SetPixels(byte r, byte g, byte b)
        {
            var buffer = new byte[LedCount * 3];
            for (var i = 0; i < buffer.Length; i += 3)
            {
                buffer[i] = r;
                buffer[i + 1] = g;
                buffer[i + 2] = b;
            }

            SetPixels(buffer, 0, 1f, 0, LedCount);
        }
        
        /// <summary>
        /// Sets a number of pixels give a byte array. This method copies datadirectly to the frame buffer so it
        /// is very fast. Always call the render method to display the results
        /// </summary>
        /// <param name="pixels">The pixels. The length of the array must be a multiple of 3</param>
        /// <param name="startPixelIndex">Start index of the RGB set. This is not the start index of the byte array but rather the index of one of the RGB sets contained by the pixel array</param>
        /// <param name="brightness">The brightness. From 0 to 1. Try to always use 1 and set the brightness by changing RGB values instead.</param>
        /// <param name="targetOffset">The target LED offset.</param>
        /// <param name="targetLength">The amount of pixels to copy over to the LED strip.</param>
        /// <exception cref="ArgumentException">The length of the buffer must be a multiple of 3 - pixels</exception>
        /// <exception cref="ArgumentNullException">pixels</exception>
        /// <exception cref="ArgumentOutOfRangeException">
        /// sourceStartIndex
        /// or
        /// targetOffset
        /// or
        /// targetLength
        /// </exception>
        public void SetPixels(
            byte[] pixels, 
            int startPixelIndex = 0, 
            float brightness = 1f, 
            int targetOffset = 0,
            int targetLength = 0)
        {
            byte brightnessByte;
            {
                // Parameter validation
                if (pixels == null)
                    throw new ArgumentNullException(nameof(pixels));

                if (pixels.Length % 3 != 0)
                    throw new ArgumentException("The length of the buffer must be a multiple of 3", nameof(pixels));

                if (startPixelIndex < 0 || startPixelIndex > (pixels.Length - targetLength) - 1)
                    throw new ArgumentOutOfRangeException(nameof(startPixelIndex));

                if (targetOffset < 0) targetOffset = 0;
                if (targetOffset > LedCount - 1)
                    throw new ArgumentOutOfRangeException(nameof(targetOffset));

                if (targetLength <= 0)
                    targetLength = pixels.Length / 3;

                if (targetOffset + targetLength > LedCount)
                    throw new ArgumentOutOfRangeException(nameof(targetLength));

                // Brightness Setting
                if (brightness < 0f) brightness = 0f;
                if (brightness > 1f) brightness = 1f;
                brightnessByte = (byte)(brightness * 31);
                brightnessByte = (byte)(brightnessByte | BrightnessSetMask);
            }

            // Offset and addresing settings
            var offsetB = ReverseRgb ? 1 : 3;
            var offsetG = 2;
            var offsetR = ReverseRgb ? 3 : 1;
            var offsetT = 0;
            var setCount = 0;
            var pixelOffsetBase = startPixelIndex * 3;
            var pixelOffsetLimit = pixelOffsetBase + (targetLength * 3);
            var frameBufferOffset = StartFrame.Length + (targetOffset * StartFrame.Length);

            // Pixel copying
            lock (_syncLock)
            {
                for (var pixelOffset = pixelOffsetBase; pixelOffset < pixelOffsetLimit; pixelOffset += 3)
                {
                    FrameBuffer[frameBufferOffset + offsetT] = brightnessByte;
                    FrameBuffer[frameBufferOffset + offsetR] = pixels[pixelOffset + 0]; // R
                    FrameBuffer[frameBufferOffset + offsetG] = pixels[pixelOffset + 1]; // G
                    FrameBuffer[frameBufferOffset + offsetB] = pixels[pixelOffset + 2]; // B
                    frameBufferOffset += StartFrame.Length;
                    setCount += 1;

                    if (setCount >= targetLength)
                        break;
                }
            }
        }

        /// <summary>
        /// Sets a number of pixels from loaded pixel data directly into the frame buffer
        /// This is the fastest method to set a number of pixels.
        /// Call the Render Method to apply!
        /// </summary>
        /// <param name="pixels">The pixel data of a previously loaded bitmap.</param>
        /// <param name="sourceOffsetX">The x offset in the bitmap to start copying pixels from</param>
        /// <param name="sourceOffsetY">The row index (y) from which to take the pixel data</param>
        /// <param name="brightness">The brightness from 0.0 to 1.0. The underlying precision is from 0 to 31</param>
        /// <param name="targetOffset">The target offset where to start setting the pixels.</param>
        /// <param name="targetLength">The number of pixels to set. 0 or less means the entire LedCount</param>
        /// <exception cref="ArgumentOutOfRangeException">startX
        /// or
        /// y</exception>
        /// <exception cref="ArgumentNullException">bitmap</exception>
        public void SetPixels(
            BitmapBuffer pixels, 
            int sourceOffsetX, 
            int sourceOffsetY, 
            float brightness = 1f,
            int targetOffset = 0, 
            int targetLength = 0)
        {
            byte brightnessByte;
            {
                // Parameter validation
                if (pixels == null)
                    throw new ArgumentNullException(nameof(pixels));

                if (sourceOffsetX < 0 || sourceOffsetX > (pixels.ImageWidth - targetLength) - 1)
                    throw new ArgumentOutOfRangeException(nameof(sourceOffsetX));

                if (sourceOffsetY < 0 || sourceOffsetY >= pixels.ImageHeight)
                {
                    throw new ArgumentOutOfRangeException(nameof(sourceOffsetY),
                          $"{nameof(sourceOffsetY)} was '{sourceOffsetY}' but it must be between '0' and '{pixels.ImageHeight - 1}'");
                }

                if (targetOffset < 0) targetOffset = 0;
                if (targetOffset > LedCount - 1)
                    throw new ArgumentOutOfRangeException(nameof(targetOffset));

                if (targetLength <= 0)
                    targetLength = LedCount;

                if (targetOffset + targetLength > LedCount)
                    throw new ArgumentOutOfRangeException(nameof(targetLength));

                // Brightness Setting
                if (brightness < 0f) brightness = 0f;
                if (brightness > 1f) brightness = 1f;
                brightnessByte = (byte)(brightness * 31);
                brightnessByte = (byte)(brightnessByte | BrightnessSetMask);
            }

            // Offset settings
            var offsetB = ReverseRgb ? 1 : 3;
            var offsetG = 2;
            var offsetR = ReverseRgb ? 3 : 1;
            var offsetT = 0;

            // Pixel copying
            lock (_syncLock)
            {
                var bmpOffsetBase = pixels.GetPixelOffset(sourceOffsetX, sourceOffsetY);
                var bmpOffsetLimit = bmpOffsetBase + (targetLength * BitmapBuffer.BytesPerPixel);
                var setCount = 0;

                var frameBufferOffset = StartFrame.Length + (targetOffset * StartFrame.Length);

                for (var bmpOffset = bmpOffsetBase; bmpOffset < bmpOffsetLimit; bmpOffset += BitmapBuffer.BytesPerPixel)
                {
                    FrameBuffer[frameBufferOffset + offsetT] = brightnessByte;
                    FrameBuffer[frameBufferOffset + offsetR] = pixels.Data[bmpOffset + BitmapBuffer.ROffset]; // R
                    FrameBuffer[frameBufferOffset + offsetG] = pixels.Data[bmpOffset + BitmapBuffer.GOffset]; // G
                    FrameBuffer[frameBufferOffset + offsetB] = pixels.Data[bmpOffset + BitmapBuffer.BOffset]; // B
                    frameBufferOffset += StartFrame.Length;
                    setCount += 1;

                    if (setCount >= targetLength)
                        break;
                }
            }
        }

        /// <summary>
        /// Renders all the pixels in the FrameBuffer
        /// </summary>
        public void Render()
        {
            lock (_syncLock)
            {
                if (Debugger.IsAttached == false)
                    _channel.Write(FrameBuffer);
            }
        }

        #endregion
    }
}