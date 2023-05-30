import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const idCardRef = useRef();
  const selfieRef = useRef();
  const isFirstRender = useRef(true);
  const observerRef = useRef()

  const renderFace = async (image, x, y, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context?.drawImage(image, x, y, width, height, 0, 0, width, height);
    canvas.toBlob((blob) => {
      image.src = URL.createObjectURL(blob);
    }, "image/jpeg");
  };

  // useEffect(() => {
  //   // Code to be executed after a certain delay
  //   const timeout = setTimeout(() => {
  //     // Your code here
      
  //     console.log("Initiate Changing of Images")
  //   }, 3000); // Delay in milliseconds (3 seconds in this example)

  //   // Clean up the timeout on component unmount or when the delay changes
  //   return () => clearTimeout(timeout);
  // }, []); // Empty dependency array to run the effect only once on component mount


  console.log("Testing")
  useEffect(() => {
    // // Prevent the function from executing on the first render
    // if (isFirstRender.current) {
    //   isFirstRender.current = false; // toggle flag after first render/mounting
    //   console.log("Testing First REnder")
    //   return;
    // }

    const performFaceDetection = async () => {
      try {
        console.log("We reached here")

        
        const cardID = 'https://firebasestorage.googleapis.com/v0/b/taguro-mobile-app.appspot.com/o/verification%2FLcAKOqeLaHQmQnuayVmbYuQcrY82%2Fcard-LcAKOqeLaHQmQnuayVmbYuQcrY82.jpg?alt=media&token=b039d676-bab0-4ab7-a98f-93b385e39749&_gl=1*o206rn*_ga*MjEyMzY3ODUxMC4xNjgxMTI1MDU2*_ga_CW55HF8NVT*MTY4NTQ2MTAyMS4xMy4xLjE2ODU0NjEwMjUuMC4wLjA.';
       const selfieID = 'https://firebasestorage.googleapis.com/v0/b/taguro-mobile-app.appspot.com/o/verification%2FLcAKOqeLaHQmQnuayVmbYuQcrY82%2Fselfie-LcAKOqeLaHQmQnuayVmbYuQcrY82.jpg?alt=media&token=d1ee484c-da4f-4bf0-a425-cb17fbd303db&_gl=1*1r81k71*_ga*MjEyMzY3ODUxMC4xNjgxMTI1MDU2*_ga_CW55HF8NVT*MTY4NTQ2MTAyMS4xMy4xLjE2ODU0NjEwNzguMC4wLjA.';

       document.getElementById('cardImage').src = 'https://firebasestorage.googleapis.com/v0/b/taguro-mobile-app.appspot.com/o/verification%2FLcAKOqeLaHQmQnuayVmbYuQcrY82%2Fcard-LcAKOqeLaHQmQnuayVmbYuQcrY82.jpg?alt=media&token=b039d676-bab0-4ab7-a98f-93b385e39749&_gl=1*o206rn*_ga*MjEyMzY3ODUxMC4xNjgxMTI1MDU2*_ga_CW55HF8NVT*MTY4NTQ2MTAyMS4xMy4xLjE2ODU0NjEwMjUuMC4wLjA.';
      document.getElementById('selfieImage').src = 'https://firebasestorage.googleapis.com/v0/b/taguro-mobile-app.appspot.com/o/verification%2FLcAKOqeLaHQmQnuayVmbYuQcrY82%2Fselfie-LcAKOqeLaHQmQnuayVmbYuQcrY82.jpg?alt=media&token=d1ee484c-da4f-4bf0-a425-cb17fbd303db&_gl=1*1r81k71*_ga*MjEyMzY3ODUxMC4xNjgxMTI1MDU2*_ga_CW55HF8NVT*MTY4NTQ2MTAyMS4xMy4xLjE2ODU0NjEwNzguMC4wLjA.';

        // loading the models
        await faceapi.nets.ssdMobilenetv1.loadFromUri('https://masego22.github.io/taguroappfm/models');
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://masego22.github.io/taguroappfm/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://masego22.github.io/taguroappfm/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://masego22.github.io/taguroappfm/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('https://masego22.github.io/taguroappfm/models');

        // detect a single face from the ID card image
        const idCardFacedetection = await faceapi.detectSingleFace(cardID,
          new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceDescriptor();

        // detect a single face from the selfie image
        const selfieFacedetection = await faceapi.detectSingleFace(selfieID.current,
          new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceDescriptor();

        /**
         * If a face was detected from the ID card image,
         * call our renderFace() method to display the detected face.
         */
        if (idCardFacedetection) {
          const { x, y, width, height } = idCardFacedetection.detection.box;
          renderFace(idCardRef.current, x, y, width, height);
        }

        /**
         * If a face was detected from the selfie image,
         * call our renderFace() method to display the detected face.
         */
        if (selfieFacedetection) {
          const { x, y, width, height } = selfieFacedetection.detection.box;
          renderFace(selfieRef.current, x, y, width, height);
        }

        /**
         * Do face comparison only when faces were detected
         */
        if (idCardFacedetection && selfieFacedetection) {
          // Using Euclidean distance to compare face descriptions
          const distance = faceapi.euclideanDistance(idCardFacedetection.descriptor, selfieFacedetection.descriptor);
          console.log(distance);
          if (distance <= 0.55) {
            console.log("Face Matched");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // const idNode = document.getElementById('cardImage')
    // const selfieNode = document.getElementById('selfieImage')

    // const config = {attributes: true, childList:true, subtree: true};

    // const callback = (mutationList, observer) => {
    //   for (const mutation of mutationList){
    //     if(mutation.type === "attributes"){
    //       console.log("src is altered")
    //       performFaceDetection();
    //     }
    //   }
    // }

    // const observer = new MutationObserver(callback);

    // observer.observe(idNode, config)
    // observer.observe(selfieNode, config)
    performFaceDetection()
  }, []);

  return (
    <>
      <div className="gallery">
        <img ref={idCardRef} id="cardImage" src={require('./images/img3.jpg')} alt="ID card" height="auto" />
      </div>

      <div className="gallery">
        <img ref={selfieRef} id="selfieImage" src={require('./images/img2.jpg')} alt="Selfie" height="auto" />
      </div>

      <div>
        This is the new One
      </div>

      <div>
        Wtf is happening here
      </div>
    </>
  );
}

export default App;