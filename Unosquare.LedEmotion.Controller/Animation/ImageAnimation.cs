namespace Unosquare.LedEmotion.Controller.Animation
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using Workers;
    using Unosquare.Swan.Formatters;

    public class ImageAnimation : IAnimation
    {
        private readonly object _syncLock = new object();
        private readonly SolidColorAnimation _currentAnimation = new SolidColorAnimation();
        private readonly List<byte[]> _colorSteps = new List<byte[]>();
        private int _currentColorStep;

        public TimeSpan TransitionTimePerPixel { get; private set; }
        
        public void SetImage(List<byte[]> imageColors, TimeSpan totalTransitionTime)
        {
            lock (_syncLock)
            {
                _colorSteps.Clear();

                foreach (var color in imageColors)
                    _colorSteps.Add(color);

                TransitionTimePerPixel =
                    TimeSpan.FromMilliseconds(totalTransitionTime.TotalMilliseconds / _colorSteps.Count);
                _currentColorStep = 0;
            }
        }

        public void PaintNextFrame()
        {
            // TODO: Implement!
            lock (_syncLock)
            {
                _currentAnimation.PaintNextFrame();

                var targetColor = _colorSteps[_currentColorStep];

                // _currentAnimation.EnqueueColor(targetColor, TransitionTimePerPixel);
                var currentRow = 1;
                BitmapBuffer pixels = null;

                LedStripWorker.Instance.LedStrip.SetPixels(pixels, 0, currentRow);
            }
        }
    }
}
