namespace Unosquare.LedEmotion.Controller.Core
{
    using System.Collections.Generic;
    using System.IO;
    using Workers;

    public class AppState
    {
        public string ImagesPath { get; set; }

        public List<SolidColorPreset> SolidColorPresets { get; private set; } = new List<SolidColorPreset>();

        public void Reset()
        {
            ImagesPath = string.Empty;
            SolidColorPresets.Clear();
        }

        public void LoadDefaults()
        {
            ImagesPath = Path.Combine(
                Path.GetDirectoryName(Program.StateFilename),
                WebServerWorker.StaticFilesFolderName,
                "uploads");

            if (Directory.Exists(ImagesPath) == false)
                Directory.CreateDirectory(ImagesPath);

            SolidColorPresets.Add(new SolidColorPreset { Name = "Off", R = 0, G = 0, B = 0 });
            SolidColorPresets.Add(new SolidColorPreset { Name = "Full Brightness", R = 255, G = 255, B = 255 });
        }
    }
}
