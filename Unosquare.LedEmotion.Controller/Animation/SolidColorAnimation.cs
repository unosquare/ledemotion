namespace Unosquare.LedEmotion.Controller.Animation
{
    using System;
    using System.Collections.Generic;
    using Workers;
    using Swan;

    public class SolidColorAnimation : IAnimation
    {
        private readonly byte[] _lastRenderedColor = new byte[3];
        private readonly Queue<byte[]> _colorQueue = new Queue<byte[]>();
        private readonly object _syncLock = new object();

        public int QueueLength => _colorQueue.Count;

        public bool IsTransitionComplete => _colorQueue.Count <= 1;

        public byte[] TargetColor { get; } = new byte[3];

        public void EnqueueColor(byte[] rgb, TimeSpan transitionTime)
        {
            lock (_syncLock)
            {
                if (LedStripWorker.Instance.CurrentAnimationType == AnimationType.SolidColor)
                    _colorQueue.Clear();
                
                if (_colorQueue.Count == 0)
                    _colorQueue.Enqueue(new byte[3]);

                rgb.CopyTo(TargetColor, 0);
                var currentColor = _colorQueue.Peek();

                // if the colors are the same just stay where we are.
                if (currentColor.Contains(rgb))
                    return;

                _colorQueue.Clear();

                var framesInTransition = Convert.ToInt32(
                    Math.Round(
                        transitionTime.TotalMilliseconds / LedStripWorker.Instance.MillisecondsPerFrame, 0));

                if (framesInTransition < 1) framesInTransition = 1;

                var currentR = Convert.ToSingle(currentColor[0]);
                var currentG = Convert.ToSingle(currentColor[1]);
                var currentB = Convert.ToSingle(currentColor[2]);

                var deltaR = (rgb[0] - currentR) / framesInTransition;
                var deltaG = (rgb[1] - currentG) / framesInTransition;
                var deltaB = (rgb[2] - currentB) / framesInTransition;

                for (var i = 0; i < framesInTransition - 1; i++)
                {
                    var colorToAdd = new byte[]
                    {
                        (byte) currentR.Clamp(0, 255),
                        (byte) currentG.Clamp(0, 255),
                        (byte) currentB.Clamp(0, 255)
                    };

                    _colorQueue.Enqueue(colorToAdd);

                    currentR += deltaR;
                    currentG += deltaG;
                    currentB += deltaB;
                }

                _colorQueue.Enqueue(rgb);
            }
        }

        public void PaintNextFrame()
        {
            lock (_syncLock)
            {
                // Ensure we have at least 1 frame
                if (_colorQueue.Count == 0)
                    _colorQueue.Enqueue(new byte[3]);

                // If we ar in the last frame, just peek it, otherwise, dequeue it.
                var c = _colorQueue.Count == 1 ? _colorQueue.Peek() : _colorQueue.Dequeue();

                if (_lastRenderedColor.Contains(c)) return;

                LedStripWorker.Instance.LedStrip.SetPixels(c[0], c[1], c[2]);
                _lastRenderedColor[0] = c[0];
                _lastRenderedColor[1] = c[1];
                _lastRenderedColor[2] = c[2];
            }
        }
    }
}