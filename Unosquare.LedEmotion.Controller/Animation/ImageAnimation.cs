namespace Unosquare.LedEmotion.Controller.Animation
{
    using System.Drawing;
    using Swan.Formatters;
    using Workers;

    public class ImageAnimation : IAnimation
    {
        private readonly object _syncLock = new object();
        private BitmapBuffer _pixels;
        private int _currentRow;
        private int _currentDirection = 1;

        public void SetImage(Bitmap imageColors)
        {
            lock (_syncLock)
            {
                _currentRow = 0;
                _pixels = new BitmapBuffer(imageColors);
            }
        }

        public void PaintNextFrame()
        {
            lock (_syncLock)
            {
                _currentRow += _currentDirection;
                if (_currentRow >= _pixels.ImageHeight)
                {
                    _currentRow = _pixels.ImageHeight - 2;
                    _currentDirection = -1;
                }
                else if (_currentRow <= 0)
                {
                    _currentRow = 1;
                    _currentDirection = 1;
                }

                LedStripWorker.Instance.LedStrip.SetPixels(_pixels, 0, _currentRow);
            }
        }
    }
}