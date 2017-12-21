namespace Unosquare.LedEmotion.Controller.Animation
{
    using System;
    using System.Collections.Generic;
    using Swan;

    public class TransitionColorAnimation : IAnimation
    {
        private readonly SolidColorAnimation _currentAnimation = new SolidColorAnimation();
        private readonly object _syncLock = new object();
        private readonly List<byte[]> _colorSteps = new List<byte[]>();
        private int _currentColorStep;
        private int _colorStepDirection = 1;

        public TimeSpan TransitionTimePerColor { get; private set; }

        public void SetTransitions(List<byte[]> rgbValues, TimeSpan totalTransitionTime)
        {
            lock (_syncLock)
            {
                _colorSteps.Clear();
                foreach (var color in rgbValues)
                    _colorSteps.Add(color);

                TransitionTimePerColor =
                    TimeSpan.FromMilliseconds(totalTransitionTime.TotalMilliseconds / _colorSteps.Count);
                _currentColorStep = 0;
                _colorStepDirection = 1;
            }
        }

        public void PaintNextFrame()
        {
            lock (_syncLock)
            {
                _currentAnimation.PaintNextFrame();
                $"Queue Length: {_currentAnimation.QueueLength}".Trace();

                if (!_currentAnimation.IsTransitionComplete) return;
                _currentColorStep += _colorStepDirection;

                if (_currentColorStep >= _colorSteps.Count)
                {
                    _colorStepDirection = -1;
                    _currentColorStep = _colorSteps.Count - 1;
                }

                if (_currentColorStep < 0)
                {
                    _currentColorStep = 0;
                    _colorStepDirection = 1;
                }

                var targetColor = _colorSteps[_currentColorStep];
                _currentAnimation.EnqueueColor(targetColor, TransitionTimePerColor);
                $"New Target Color is: {_currentAnimation.TargetColor[0]}, {_currentAnimation.TargetColor[1]}, {_currentAnimation.TargetColor[2]}"
                    .Trace();
            }
        }
    }
}