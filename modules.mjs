export async function app() {
  var app = new Vue({
    el: '#app',
    data: {
      status: 'Waiting...'
    },
    computed: {
      result: {
        get: function() {
          return this.status;
        },
        set: function(val) {
          this.status = val;
        }
      }
      
    },
    methods: {
      start: function (event) {
        play(); 
      }
    }
  })


  const video = document.querySelector("#video");
  const barcodeDetector = new BarcodeDetector();

  (async () => {
    const supportedFormats = (await BarcodeDetector.getSupportedFormats()).join("\n")
    app.result = supportedFormats;
  })().catch(err => {
    app.result = err;
  });

  const capture = async () => {
    try {

      const barcodes = await barcodeDetector.detect(video);
      const log = barcodes.map(({format, rawValue}) => `- ${format}: ${rawValue}`).join("\n");
      app.result = log;
    } catch (err) {
      app.result = err;
    }
  };
    
    video.addEventListener("play", () => capture());

    const play = async () => {
      (async () => {
        const media = await navigator
          .mediaDevices
          .getUserMedia(
          {
            audio: false, 
            video: {
              facingMode: "environment"
            }
          });

        video.srcObject = media;
        video.autoplay = true;
      })();
    };

 
}