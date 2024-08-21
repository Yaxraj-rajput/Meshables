import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../../firebase";

import PageTitle from "../Components/UI/PageTitle";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  uploadBytes,
} from "firebase/storage";
import { useUser } from "../Context/UserProvider";
import { Helmet } from "react-helmet";
import plus_icon from "../assets/Icons/plus.png";

const Upload = () => {
  const { currentUser } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    description: "",
    is3d: false,
    price: "",
    discount: "",
    tags: "",
    date: new Date()
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
      .replace(/ /g, ", "),
    category: "",
    model: "",
    images: "",
    resolution: "",
    physicalSize: "",
    lods: "",
    vertices: "",
    textures: "",
    materials: "",
    uvMapping: false,
    rigged: false,
    animated: false,
    vrArLowPoly: false,
  });

  const [tags, setTags] = useState([]);

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setFormData({ ...formData, tags: "" });
    } else {
      setFormData({ ...formData, tags: value });
    }
  };

  const uploadFile = async (file) => {
    try {
      console.log("Uploading file:", file.name);
      const storageRef = ref(storage, `assets/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file); // This should be awaited or handled differently since uploadBytes is a promise

      // Correctly handle the promise returned by uploadBytes
      const uploadSnapshot = await uploadTask;

      console.log(`Upload is 100% done`);

      // Get the download URL after the upload is complete
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);
      console.log("File available at", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null; // Ensure function returns null or appropriate value in case of error
    }
  };

  const uploadThumbnail = async (file) => {
    try {
      console.log("Uploading thumbnail:", file.name);
      const storageRef = ref(storage, `thumbnails/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file); // This should be awaited or handled differently since uploadBytes is a promise

      // Correctly handle the promise returned by uploadBytes
      const uploadSnapshot = await uploadTask;

      console.log(`Upload is 100% done`);

      // Get the download URL after the upload is complete
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);
      console.log("Thumbnail available at", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      return null; // Ensure function returns null or appropriate value in case of error
    }
  };

  const uploadImages = async (files) => {
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      return [];
    }
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Start with the base object
      let docData = {
        title: formData.title,
        thumbnail: await uploadThumbnail(formData.thumbnail),
        description: formData.description,
        is3d: formData.is3d,
        price: formData.price,
        discount: formData.discount,
        resolution: formData.resolution,
        category: formData.category,
        type: formData.type,
        tags: tags,
        date: new Date(formData.date),
        userId: currentUser.uid ?? "anonymous", // Ensure userId is set to a default value if currentUser is null,
      };

      // Conditionally add 3D specific properties

      if (!formData.is3d) {
        docData = {
          ...docData,
          images: await uploadImages(formData.images),
        };
      }

      if (formData.is3d) {
        docData = {
          ...docData,
          model: await uploadFile(formData.model),
          physicalSize: formData.physicalSize,
          lods: formData.lods,
          vertices: formData.vertices,
          textures: formData.textures,
          materials: formData.materials,
          uvMapping: formData.uvMapping,
          rigged: formData.rigged,
          animated: formData.animated,
          vrArLowPoly: formData.vrArLowPoly,
        };
      }

      // Validate docData to remove undefined fields
      docData = Object.fromEntries(
        Object.entries(docData).filter(([_, v]) => v !== undefined)
      );

      // Log the data to be added
      console.log("Data to be added:", docData);

      // Now, docData contains all the necessary properties
      await addDoc(collection(db, "Assets"), docData);

      alert("Document successfully added!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Upload | Meshables</title>
        <meta name="description" content="Upload your 3D assets to Meshables" />

        <meta property="og:type" content="website" />

        <meta property="og:title" content="Upload | Meshables" />
        <meta
          property="og:description"
          content="Upload your 3D assets to Meshables"
        />

        <meta property="og:url" content="https://meshables.me/#/upload" />
      </Helmet>

      {currentUser ? (
        <div className="page_content">
          <div className="upload_section">
            <form onSubmit={handleSubmit}>
              <PageTitle title="Upload Asset">Upload</PageTitle>

              <div className="content">
                <div className="left">
                  <input
                    type="file"
                    required
                    name="thumbnail"
                    id="thumbnail_input"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        thumbnail: e.target.files[0],
                      });
                    }}
                  />
                  <label
                    htmlFor="thumbnail_input"
                    className="thumbnail_input_label"
                  >
                    {formData.thumbnail ? (
                      <>
                        <img
                          src={URL.createObjectURL(formData.thumbnail)}
                          alt="thumbnail"
                        />
                        <span className="file_name">
                          {formData.thumbnail.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <img className="upload_icon" src={plus_icon} alt="" />{" "}
                        <span className="placeholder">Choose Thumbnail</span>
                      </>
                    )}
                  </label>

                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                  />

                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                </div>

                <div className="right">
                  <select name="type" onChange={handleChange} required>
                    <option value="" disabled selected>
                      Select Asset type
                    </option>
                    <option value="materials">Material</option>
                    <option value="models">Model</option>
                    <option value="printables">Printable</option>
                    <option value="textures">Texture</option>
                    <option value="sounds">Sound</option>
                    <option value="scripts">Script</option>
                    <option value="images">Image</option>
                    <option value="videos">Video</option>
                    <option value="hdris">HDRIs</option>
                    <option value="other">Other</option>
                  </select>
                  <select name="category" onChange={handleChange} required>
                    <option
                      value=""
                      disabled
                      selected={formData.category === ""}
                    >
                      Select Category
                    </option>
                    <option value="Living Room">Living Room</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Office">Office</option>
                    <option value="Sports">Sports</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Tools">Tools</option>
                    <option value="Clothing">Clothing</option>
                    <option value="other">other</option>
                  </select>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    type="number"
                    required
                  />
                  <input
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="Discount"
                    type="number"
                  />
                  <div className="tags_input">
                    {tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={handleTagInputChange}
                      placeholder="Tags (comma-separated)"
                    />
                  </div>
                  <label>
                    <input
                      name="is3d"
                      type="checkbox"
                      checked={formData.is3d}
                      onChange={handleChange}
                    />{" "}
                    Is 3D
                  </label>
                  {
                    // if is 3d is false ask for images

                    !formData.is3d ? (
                      <>
                        <label>Images</label>

                        <div className="images_upload">
                          <input
                            name="images"
                            type="file"
                            id="images_input"
                            multiple
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                images: e.target.files,
                              });
                            }}
                            required
                          />
                          <label
                            htmlFor="images_input"
                            className="images_input"
                          >
                            <img
                              className="icon"
                              src={plus_icon}
                              alt="Add Images"
                            />
                          </label>
                          {/* <div className="preview_images"> */}
                          {formData.images &&
                            Array.from(formData.images).map((image) => (
                              <div className="image">
                                <img
                                  key={image.name}
                                  src={URL.createObjectURL(image)}
                                  alt={image.name}
                                />
                              </div>
                            ))}
                          {/* </div> */}
                        </div>
                      </>
                    ) : null
                  }
                  {formData.is3d && (
                    <>
                      <label>Model </label>

                      <input
                        name="model"
                        id="fileInput"
                        type="file"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            model: e.target.files[0],
                          });
                        }}
                        required
                      />

                      <label for="fileInput" className="custom-file-input">
                        Choose Model
                      </label>

                      <input
                        name="resolution"
                        type="text"
                        placeholder="Resolution"
                        onChange={handleChange}
                      />
                      <input
                        name="physicalSize"
                        type="text"
                        placeholder="Physical Size"
                        onChange={handleChange}
                      />
                      <input
                        name="lods"
                        type="number"
                        placeholder="LODs"
                        onChange={handleChange}
                      />
                      <input
                        name="vertices"
                        type="number"
                        placeholder="Vertices"
                        onChange={handleChange}
                      />

                      <div className="checkboxes">
                        <label>
                          <input
                            type="checkbox"
                            name="textures"
                            checked={formData.textures}
                            onChange={handleChange}
                          />
                          Textures
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="materials"
                            checked={formData.materials}
                            onChange={handleChange}
                          />
                          Materials
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name="rigged"
                            checked={formData.rigged}
                            onChange={handleChange}
                          />
                          Rigged
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            name="animated"
                            checked={formData.animated}
                            onChange={handleChange}
                          />
                          Animated
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            name="uvMapping"
                            checked={formData.uvMapping}
                            onChange={handleChange}
                          />
                          UV Mapping
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            name="vrArLowPoly"
                            checked={formData.vrArLowPoly}
                            onChange={handleChange}
                          />
                          VR/AR Low Poly
                        </label>
                      </div>
                    </>
                  )}{" "}
                </div>
              </div>
              <button type="submit">Upload</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="page_content">
          <div className="not_logged_in">
            <h2>Log in to upload assets</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;
