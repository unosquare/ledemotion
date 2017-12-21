namespace Unosquare.LedEmotion.Controller.Core
{
    using Swan;

    /// <summary>
    /// Represents an LED in a strip of LEDs
    /// This class is not meant to be instantiated by the user.
    /// </summary>
    public class DotStarLedStripPixel
    {
        private readonly int _baseAddress;
        private readonly DotStarLedStrip _owner;

        /// <summary>
        /// Initializes a new instance of the <see cref="DotStarLedStripPixel"/> class.
        /// </summary>
        /// <param name="owner">The owner.</param>
        /// <param name="baseAddress">The base address.</param>
        public DotStarLedStripPixel(DotStarLedStrip owner, int baseAddress)
        {
            _owner = owner;
            _baseAddress = baseAddress;
        }

        /// <summary>
        /// Gets or sets the brightness, from 0 to 1.
        /// </summary>
        public float Brightness
        {
            get
            {
                var brightnessByte = (byte)(DotStarLedStrip.BrightnessGetMask & _owner.FrameBuffer[_baseAddress]);
                return brightnessByte / 31f;
            }
            set
            {
                // clamp value
                value = value.Clamp(0f, 1f);
                var brightnessByte = (byte)(value * 31);
                _owner.FrameBuffer[_baseAddress] = (byte)(brightnessByte | DotStarLedStrip.BrightnessSetMask);
            }
        }

        /// <summary>
        /// The Red Buye
        /// </summary>
        public byte R
        {
            get => _owner.ReverseRgb ? _owner.FrameBuffer[_baseAddress + 3] : _owner.FrameBuffer[_baseAddress + 1];
            set
            {
                if (_owner.ReverseRgb)
                    _owner.FrameBuffer[_baseAddress + 3] = value;
                else
                    _owner.FrameBuffer[_baseAddress + 1] = value;
            }
        }

        /// <summary>
        /// The green
        /// </summary>
        public byte G
        {
            get => _owner.FrameBuffer[_baseAddress + 2];
            set => _owner.FrameBuffer[_baseAddress + 2] = value;
        }

        /// <summary>
        /// The blue
        /// </summary>
        public byte B
        {
            get => _owner.ReverseRgb ? _owner.FrameBuffer[_baseAddress + 1] : _owner.FrameBuffer[_baseAddress + 3];
            set
            {
                if (_owner.ReverseRgb)
                    _owner.FrameBuffer[_baseAddress + 1] = value;
                else
                    _owner.FrameBuffer[_baseAddress + 3] = value;
            }
        }
    }
}