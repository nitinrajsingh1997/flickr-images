import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import debounce from "./utils/debounce";
import Loader from "react-loader-spinner";
import ModalImage from "react-modal-image";

function App() {
  // text field value
  const [value, setValue] = useState("");
  // array for storing the url of images
  const [picArr, setPicArr] = useState([]);
  // page number
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  var arr = [];

  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=b62e2febfeb0c57b2a8da1e10bb37d6f&page=${page}&per_page=5&format=json&nojsoncallback=1`;
  const searchUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=b62e2febfeb0c57b2a8da1e10bb37d6f&text=${value}&page=${page}&per_page=5&media=photos&format=json&nojsoncallback=1`;

  //function to get recent images
  const getRecentImages = () => {
    axios
      .get(url, {
        headers: {},
      })
      .then((res) => {
        res.data.photos.photo.map((pic) => {
          var url = `https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`;
          arr.push(url);
        });
        setPicArr([...picArr, ...arr]);
      });
    setPage(page + 1);
  };

  useEffect(() => {
    getRecentImages();
    setPicArr([]);
  }, [value]);

  // function to search images
  const fetchImages = () => {
    axios
      .get(searchUrl, {
        headers: {},
      })
      .then((res) => {
        res.data.photos.photo.map((pic) => {
          var url = `https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`;
          arr.push(url);
        });
        setPicArr([...picArr, ...arr]);
      });
    setPage(page + 1);
  };

  // debounce the fetchImages function
  const optimizedSearch = useCallback(debounce(fetchImages, 400), []);

  return (
    <div className="App flex">
      <div
        className="top"
        style={{ backgroundColor: "black", width: "100%", textAlign: "center" }}
      >
        <h3 style={{ color: "#fff" }}>Search Photos</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            optimizedSearch(e.target.value);
          }}
          placeholder="Enter text to search images..."
        />
      </div>

      <InfiniteScroll
        dataLength={picArr.length}
        next={fetchImages}
        hasMore={hasMore}
        loader={
          <Loader
            type="TailSpin"
            color="#000"
            height={50}
            width={50}
            timeout={3000}
          />
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="main flex">
          {picArr.map((data, key) => (
            <div className="container" key={key}>
              <ModalImage small={data} large={data} alt="" />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
export default App;
