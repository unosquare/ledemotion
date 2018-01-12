namespace Unosquare.LedEmotion.Controller.Core
{
    using System.Collections.Generic;

    public class AppState
    {
        public List<SolidColorPreset> SolidColorPresets { get; } = new List<SolidColorPreset>();

        public void Reset()
        {
            SolidColorPresets.Clear();
        }
    }
}