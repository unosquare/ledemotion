namespace Unosquare.LedEmotion.Controller.Animation
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using Unosquare.Swan.Formatters;

    public class ImageAnimation : IAnimation
    {
        private readonly object _syncLock = new object();
        private readonly SolidColorAnimation _currentAnimation = new SolidColorAnimation();
        private readonly List<byte[]> _colorSteps = new List<byte[]>();
        private int _currentColorStep;

        public TimeSpan TransitionTimePerPixel { get; private set; }
        
        public void SetImage(Image image, TimeSpan totalTransitionTime)
        {
            lock (_syncLock)
            {
                var pixels = new BitmapBuffer(image);

                _colorSteps.Clear();

                // foreach (var color in rgbValues)
                //    _colorSteps.Add(color);
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
                _currentAnimation.EnqueueColor(targetColor, TransitionTimePerPixel);
            }
        }
    }
}
