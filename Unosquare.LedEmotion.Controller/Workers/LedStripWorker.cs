﻿namespace Unosquare.LedEmotion.Controller.Workers
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.Threading;
    using Animation;
    using Core;
    using Swan;
    using Swan.Abstractions;

    /// <summary>
    /// Represents a worker capable of initializing and animating the LED strip
    /// </summary>
    /// <seealso cref="LedStripWorker" />
    /// <seealso cref="IWorker" />
    public class LedStripWorker : SingletonBase<LedStripWorker>, IWorker
    {
        #region Private Declarations

        private static readonly object SyncLock = new object();

        private readonly Dictionary<AnimationType, IAnimation> _animations = new Dictionary<AnimationType, IAnimation>()
        {
            {AnimationType.SolidColor, new SolidColorAnimation()},
            {AnimationType.Transition, new TransitionColorAnimation()},
            {AnimationType.Image, new ImageAnimation()},
        };

        private Thread _animationThread;

        /// <summary>
        /// Prevents a default instance of the <see cref="LedStripWorker"/> class from being created.
        /// </summary>
        private LedStripWorker()
            : base()
        {
            // placeholder
        }

        #endregion

        #region Public Properties

        /// <summary>
        /// Gets the led count.
        /// </summary>
        public int LedCount { get; private set; } = 240;

        /// <summary>
        /// Gets the frames per second.
        /// </summary>
        public int FramesPerSecond { get; private set; } = 25;

        /// <summary>
        /// Gets the spi channel.
        /// </summary>
        public int SpiChannel { get; private set; } = 1;

        /// <summary>
        /// Gets the spi frequency.
        /// </summary>
        public int SpiFrequency { get; private set; } =
            1000000; // 1MHz is plenty for 240 LEDs at 24 FPS (4 bytes * 240 LEDs * 25 FPS = ~24kHz minimum)

        /// <summary>
        /// Gets the milliseconds per frame.
        /// </summary>
        public int MillisecondsPerFrame { get; private set; }

        /// <summary>
        /// Gets the frame number.
        /// </summary>
        public ulong FrameNumber { get; private set; }

        /// <summary>
        /// Gets a value indicating whether this instance is pending stop.
        /// </summary>
        public bool IsPendingStop { get; private set; }

        /// <summary>
        /// Gets the led strip.
        /// </summary>
        public DotStarLedStrip LedStrip { get; private set; }

        #endregion

        #region Init, Start and Stop

        /// <summary>
        /// Gets or sets the type of the current animation.
        /// </summary>
        /// <value>
        /// The type of the current animation.
        /// </value>
        public AnimationType CurrentAnimationType { get; set; } = AnimationType.SolidColor;

        private IAnimation CurrentAnimation => _animations[CurrentAnimationType];

        /// <summary>
        /// Sets the start parameters parameters.
        /// </summary>
        /// <param name="ledCount">The led count.</param>
        /// <param name="spiChannel">The spi channel.</param>
        /// <param name="spiFrequency">The spi frequency.</param>
        /// <param name="framesPerSecond">The frames per second.</param>
        public void SetParameters(int ledCount, int spiChannel, int spiFrequency, int framesPerSecond)
        {
            LedCount = ledCount;
            SpiChannel = spiChannel;
            SpiFrequency = spiFrequency;
            FramesPerSecond = framesPerSecond;
            MillisecondsPerFrame = Convert.ToInt32(Math.Round(1f / FramesPerSecond * 1000f, 0));

            if (FramesPerSecond <= 1)
                FramesPerSecond = 25;
        }

        /// <summary>
        /// Should start the task immediately and asynchronously
        /// </summary>
        public void Start()
        {
            SetParameters(LedCount, SpiChannel, SpiFrequency, FramesPerSecond);

            lock (SyncLock)
            {
                if (LedStrip != null) return;

                using (var tickLock = new ManualResetEvent(false))
                {
                    LedStrip = new DotStarLedStrip(
                        ledCount: LedCount,
                        spiChannel: SpiChannel,
                        spiFrequency: SpiFrequency,
                        reverseRgb: true);

                    LedStrip.ClearPixels();
                    LedStrip.Render();

                    for (var i = 0; i < LedCount; i++)
                    {
                        LedStrip.SetPixel(i, 1f, 255, 0, 0);
                        LedStrip.Render();
                        tickLock.WaitOne(10);
                    }

                    for (var i = 0; i < 3; i++)
                    {
                        LedStrip.SetPixels(0, 255, 0);
                        LedStrip.Render();
                        tickLock.WaitOne(200);
                        LedStrip.ClearPixels();
                        LedStrip.Render();
                        tickLock.WaitOne(200);
                    }

                    LedStrip.Render();

                    IsPendingStop = false;

                    _animationThread = new Thread(AnimateContinuosly)
                    {
                        IsBackground = true
                    };

                    _animationThread.Start();
                }
            }
        }

        private void RestartAnimation()
        {
            SetParameters(LedCount, SpiChannel, SpiFrequency, FramesPerSecond);

            lock (SyncLock)
            {
                if (LedStrip != null)
                    return;

                LedStrip = new DotStarLedStrip(
                    ledCount: LedCount,
                    spiChannel: SpiChannel,
                    spiFrequency: SpiFrequency,
                    reverseRgb: true);

                LedStrip.ClearPixels();
                LedStrip.Render();

                IsPendingStop = false;

                _animationThread = new Thread(AnimateContinuosly)
                {
                    IsBackground = true
                };

                _animationThread.Start();
            }
        }

        /// <summary>
        /// Restarts this instance.
        /// </summary>
        public void Restart()
        {
            Restart(LedCount, SpiChannel, SpiFrequency, FramesPerSecond);
        }

        /// <summary>
        /// Restarts the LedStripWorker with the specified parameters
        /// </summary>
        /// <param name="ledCount">The led count.</param>
        /// <param name="spiChannel">The spi channel.</param>
        /// <param name="spiFrequency">The spi frequency.</param>
        /// <param name="framesPerSecond">The frames per second.</param>
        /// <param name="value">The value.</param>
        public void Restart(int ledCount, int spiChannel, int spiFrequency, int framesPerSecond, int value = 0)
        {
            Stop();
            SetParameters(ledCount, spiChannel, spiFrequency, framesPerSecond);

            if (value == 1)
            {
                Start();
            }
        }

        /// <summary>
        /// Should stop the task immediately and synchronously
        /// </summary>
        public void Stop()
        {
            lock (SyncLock)
            {
                if (LedStrip == null) return;

                IsPendingStop = true;

                using (var sleepLock = new ManualResetEvent(false))
                {
                    while (_animationThread.ThreadState == ThreadState.Running)
                        sleepLock.WaitOne(1);
                }

                _animationThread = null;

                LedStrip.ClearPixels();
                LedStrip.Render();
                LedStrip.Render();
                LedStrip = null;
            }
        }

        #endregion

        #region Animation

        /// <summary>
        /// Changes the animation mode to Color
        /// </summary>
        /// <param name="rgbValue">The RGB value.</param>
        /// <param name="transitionTime">The transition time.</param>
        public void SetColor(byte[] rgbValue, TimeSpan transitionTime)
        {
            lock (SyncLock)
            {
                if (transitionTime.TotalMilliseconds < MillisecondsPerFrame)
                    transitionTime = TimeSpan.FromMilliseconds(MillisecondsPerFrame);

                if (transitionTime.TotalMilliseconds > MillisecondsPerFrame * 1024)
                    transitionTime = TimeSpan.FromMilliseconds(MillisecondsPerFrame * 1024);

                var animation = _animations[AnimationType.SolidColor] as SolidColorAnimation;
                CurrentAnimationType = AnimationType.SolidColor;
                animation.EnqueueColor(rgbValue, transitionTime);
                RestartAnimation();
            }
        }

        public void SetTransition(List<byte[]> rgbValues, TimeSpan totalTransitionTime)
        {
            lock (SyncLock)
            {
                var animation = _animations[AnimationType.Transition] as TransitionColorAnimation;
                animation.SetTransitions(rgbValues, totalTransitionTime);
                CurrentAnimationType = AnimationType.Transition;
                RestartAnimation();
            }
        }

        public void SetImage(Bitmap imageColors)
        {
            lock (SyncLock)
            {
                var animation = _animations[AnimationType.Image] as ImageAnimation;

                animation.SetImage(imageColors);
                CurrentAnimationType = AnimationType.Image;
                RestartAnimation();
            }
        }

        /// <summary>
        /// This is a thread worker. It performs the continuous animation until Stop is called.
        /// </summary>
        private void AnimateContinuosly()
        {
            var startFrameTime = DateTime.UtcNow;

            using (var tickLock = new ManualResetEvent(false))
            {
                while (IsPendingStop == false)
                {
                    startFrameTime = DateTime.UtcNow;
                    FrameNumber = (FrameNumber == UInt64.MaxValue) ? 1 : FrameNumber + 1;

                    lock (SyncLock)
                    {
                        CurrentAnimation.PaintNextFrame();
                        LedStrip.Render();
                    }

                    var elapsedToFrame = MillisecondsPerFrame -
                                         Convert.ToInt32(DateTime.UtcNow.Subtract(startFrameTime).TotalMilliseconds);

                    if (elapsedToFrame <= 0)
                    {
                        "Frames are lagging. Increase the frequency or simplify the rendering logic."
                            .Warn(); // typeof(LedStripWorker));
                        continue;
                    }

                    tickLock.WaitOne(elapsedToFrame);
                }
            }
        }

        #endregion
    }
}