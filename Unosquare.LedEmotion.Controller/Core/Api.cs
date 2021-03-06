﻿namespace Unosquare.LedEmotion.Controller.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Labs.EmbedIO;
    using Labs.EmbedIO.Modules;
    using Workers;
    using Swan;
    using Swan.Formatters;
    using Unosquare.Labs.EmbedIO.Constants;
    using Unosquare.Net;
    using Models;
    using Unosquare.Swan.Components;
    using System.Drawing;

    public class Api : WebApiController
    {
        private const string RelativePath = "/api/";

        [WebApiHandler(HttpVerbs.Post, RelativePath + "status")]
        public Task<bool> PostStatus(WebServer server, HttpListenerContext context)
        {
            // http://localhost:9696/api/status?r=10&g=245&b=96
            LedStripWorker.Instance.SetColor(new[]
            {
                byte.Parse(context.Request.QueryString["r"]),
                byte.Parse(context.Request.QueryString["g"]),
                byte.Parse(context.Request.QueryString["b"])
            }, TimeSpan.FromMilliseconds(LedStripWorker.Instance.MillisecondsPerFrame * 10));

            return context.JsonResponseAsync(new {Name = "STATUS POST"});
        }

        [WebApiHandler(HttpVerbs.Get, RelativePath + "status")]
        public Task<bool> GetStatus(WebServer server, HttpListenerContext context)
        {
            var nameList = new List<string>();

            try
            {
                var interfacesOutput = ProcessRunner.GetProcessOutputAsync("ifconfig").Result;
                var outputLines = interfacesOutput.Split('\n').Where(x => string.IsNullOrWhiteSpace(x) == false).ToArray();
                var name = string.Empty;

                foreach (var item in outputLines)
                {
                    if (item[0] >= 'a' && item[0] <= 'z')
                    {
                        name = item.Substring(0, item.IndexOf(':'));
                    }

                    if (item.IndexOf("RX packets") == -1) continue;
                    var packets = item.Substring(item.IndexOf("RX packets") + 11, 5);
                    var index = packets.IndexOf(' ');
                    var packetsValue = index != -1 ? int.Parse(packets.Substring(0, index)) : int.Parse(packets);

                    if (packetsValue <= 0) continue;
                    name = name.StartsWith("eth") ? "Wired" : name;
                    name = name.StartsWith("wlan") ? "Wireless" : name;
                    nameList.Add(name);
                }
            }
            catch (Exception)
            {
                // Empty
            }

            return context.JsonResponseAsync(new
            {
                ConnectionType = nameList,
                PublicIP = Network.GetPublicIPAddress(),
                LocalIPs = Network.GetIPv4Addresses()
            });
        }

        [WebApiHandler(HttpVerbs.Get, RelativePath + "appstate")]
        public Task<bool> GetAppState(WebServer server, HttpListenerContext context)
        {
            return context.JsonResponseAsync(Program.State);
        }

        [WebApiHandler(HttpVerbs.Put, RelativePath + "color")]
        public Task<bool> PutColor(WebServer server, HttpListenerContext context)
        {
            try
            {
                var data = Json.Deserialize(context.RequestBody()) as Dictionary<string, object>;
                var rgb = new byte[3];
                var frames = byte.Parse(data["F"].ToString());

                var transitionTime = TimeSpan.FromMilliseconds(LedStripWorker.Instance.MillisecondsPerFrame * frames);

                rgb[0] = byte.Parse(data["R"].ToString());
                rgb[1] = byte.Parse(data["G"].ToString());
                rgb[2] = byte.Parse(data["B"].ToString());

                LedStripWorker.Instance.SetColor(rgb, transitionTime);

                return context.JsonResponseAsync(new
                {
                    Cl = $"rgb({rgb[0]}, {rgb[1]}, {rgb[2]})",
                    Ms = $"{transitionTime.TotalMilliseconds}"
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }

        [WebApiHandler(HttpVerbs.Delete, RelativePath + "preset")]
        public Task<bool> DeletePreset(WebServer server, HttpListenerContext context)
        {
            try
            {
                var data = Json.Deserialize(context.RequestBody()) as Dictionary<string, object>;

                var removeTarget =
                    Program.State.SolidColorPresets.FirstOrDefault(d => d.Name.Equals(data["Name"] as string));

                if (removeTarget != null)
                {
                    Program.State.SolidColorPresets.Remove(removeTarget);
                    Program.SaveState();
                }

                return context.JsonResponseAsync(Program.State);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }

        [WebApiHandler(HttpVerbs.Post, RelativePath + "preset")]
        public Task<bool> AddPreset(WebServer server, HttpListenerContext context)
        {
            try
            {
                var data = Json.Deserialize<SolidColorPreset>(context.RequestBody());

                var existingTarget =
                    Program.State.SolidColorPresets.FirstOrDefault(d => d.Name.Equals(data.Name));

                if (existingTarget != null)
                    data.CopyPropertiesTo(existingTarget);
                else
                    Program.State.SolidColorPresets.Add(data);

                Program.SaveState();
                return context.JsonResponseAsync(Program.State);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }

        [WebApiHandler(HttpVerbs.Get, RelativePath + "settings")]
        public Task<bool> GetSettings(WebServer server, HttpListenerContext context)
        {
            try
            { 
                var settings = new AppSettings
                {
                    FramesPerSecond = LedStripWorker.Instance.FramesPerSecond,
                    LedCount = LedStripWorker.Instance.LedCount,
                    SpiChannel = LedStripWorker.Instance.SpiChannel,
                    SpiFrequency = LedStripWorker.Instance.SpiFrequency,
                };

                return context.JsonResponseAsync(settings);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }
        
        [WebApiHandler(HttpVerbs.Post, RelativePath + "settings")]
        public Task<bool> PostSettings(WebServer server, HttpListenerContext context)
        {
            try
            {
                var data = Json.Deserialize<AppSettings>(context.RequestBody());
                LedStripWorker.Instance.Restart(data.LedCount, data.SpiChannel, data.SpiFrequency, data.FramesPerSecond, 1);

                return context.JsonResponseAsync(new
                {
                    Status = "ok"
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }

        [WebApiHandler(HttpVerbs.Put, RelativePath + "transition")]
        public Task<bool> PutTranstion(WebServer server, HttpListenerContext context)
        {
            try
            {
                var data = Json.Deserialize(context.RequestBody()) as Dictionary<string, object>;

                var transitionTime = TimeSpan.FromSeconds(int.Parse(data["Delay"].ToString()));
                var transitionColors = new List<byte[]>();
                var colors = data["Colors"] as List<object>;

                foreach (List<object> color in colors)
                {
                    transitionColors.Add(new[]
                    {
                        Convert.ToByte((decimal) color[0]),
                        Convert.ToByte((decimal) color[1]),
                        Convert.ToByte((decimal) color[2])
                    });
                }

                LedStripWorker.Instance.SetTransition(transitionColors, transitionTime);

                return context.JsonResponseAsync(new
                {
                    Cl = $"{colors.Count}",
                    Ms = $"{transitionTime.TotalMilliseconds}"
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }

        [WebApiHandler(HttpVerbs.Post, RelativePath + "image")]
        public Task<bool> SaveImage(WebServer server, HttpListenerContext context)
        {
            try
            {
                byte frames = 6;
                var data = Json.Deserialize<ImagePreset>(context.RequestBody());

                var stringIm = data.Data.Replace(data.Type, string.Empty).Substring(13);
                byte[] bytes = Convert.FromBase64String(stringIm);

                var transitionTime = TimeSpan.FromMilliseconds(LedStripWorker.Instance.MillisecondsPerFrame * frames);
                
                Bitmap img = (Bitmap)new ImageConverter().ConvertFrom(bytes);

                int width = LedStripWorker.Instance.LedCount;
                int height = (img.Height * width) / img.Width;
                
                Bitmap bitmap = new Bitmap(width, height);

                using (Graphics graphics = Graphics.FromImage(bitmap))
                    graphics.DrawImage(img, 0, 0, width, height);
                img = bitmap;
                
                LedStripWorker.Instance.SetImage(img);
                
                return context.JsonResponseAsync(Program.State);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }

        [WebApiHandler(HttpVerbs.Put, RelativePath + "stop")]
        public Task<bool> StopAnimation(WebServer server, HttpListenerContext context)
        {
            try
            {
                LedStripWorker.Instance.Restart();

                return context.JsonResponseAsync(new
                {
                    Status = "OK"
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                return context.JsonResponseAsync(new
                {
                    ErrorType = ex.GetType().ToString(),
                    ex.Message
                });
            }
        }
    }
}