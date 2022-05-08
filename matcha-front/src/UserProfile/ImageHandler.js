import React from "react";
import ImageUploading from "react-images-uploading";
import { Carousel } from "react-bootstrap";

import person_icon from "../assets/person-icon.jpeg";

import "./UserProfile.css";

import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1920,
      1080,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export default function ImageHandler(props) {
  const [images, setImages] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const maxNumber = 5;

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const onChange = (imageList) => {
    // data for submit
    // RESIZE IMAGE TO STOCK IN DB ?
    // let resizedImages = imageList.map(async (curr) => await resizeFile(curr));
    setImages(imageList);
    props.toUpload(imageList);
    if (imageList.length > 0) setIndex(imageList.length - 1);
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        <div className="upload__image-wrapper">
          <Carousel
            className="carousel"
            variant="white"
            activeIndex={index}
            onSelect={handleSelect}
            interval={null}
          >
            {images.length === 0 ? (
              <Carousel.Item key={index}>
                <img alt="" src={person_icon} width="230" height="220" />
                <div className="image-item__btn-wrapper">
                  <button
                    className="button-delete"
                    style={{ width: "3.5rem" }}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    Add
                  </button>
                </div>
              </Carousel.Item>
            ) : (
              images.map((image, index) => {
                return (
                  <Carousel.Item key={index} align="center">
                    <div key={index} className="image-item" align="center">
                      <img
                        className="objectfit"
                        src={image["data_url"]}
                        alt=""
                        width="230"
                        height="200"
                      />
                      <div className="image-item__btn-wrapper">
                        <button
                          className="button-delete"
                          style={{ width: "5rem" }}
                          onClick={() => onImageRemove(index)}
                        >
                          Delete
                        </button>{" "}
                        <button
                          className="button-delete"
                          style={{ width: "3.5rem" }}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </Carousel.Item>
                );
              })
            )}
          </Carousel>
        </div>
      )}
    </ImageUploading>
  );
}
