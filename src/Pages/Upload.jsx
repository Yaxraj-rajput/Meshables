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
import DescriptionBox from "../Components/DescriptionBox";

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
  const [loadingState, setLoadingState] = useState(false);

  const handleTagInputChange = (e) => {
    const value = e.target.value;

    // if nothing is entered and user presses backspace remove last tag
    if (value === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
      return;
    }

    if (value.endsWith(" ")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setFormData({ ...formData, tags: " " });
    } else {
      setFormData({ ...formData, tags: value });
    }
  };

  const uploadFile = async (file) => {
    try {
      setLoadingState(`Uploading ${file.name}`);

      const storageRef = ref(storage, `assets/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file); // This should be awaited or handled differently since uploadBytes is a promise

      // Correctly handle the promise returned by uploadBytes
      const uploadSnapshot = await uploadTask;

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
      setLoadingState(`Uploading thumbnail`);
      const storageRef = ref(storage, `thumbnails/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file); // This should be awaited or handled differently since uploadBytes is a promise

      // Correctly handle the promise returned by uploadBytes
      const uploadSnapshot = await uploadTask;

      // Get the download URL after the upload is complete
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);
      return downloadURL;
    } catch (error) {
      alert("Error uploading thumbnail:", error);
      return null; // Ensure function returns null or appropriate value in case of error
    }
  };

  const uploadImages = async (files) => {
    try {
      setLoadingState(`Uploading images: (${files.length} files)`);
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

    setLoadingState("Uploading asset...");

    try {
      // Start with the base object
      let docData = {
        title: formData.title,
        thumbnail: await uploadThumbnail(formData.thumbnail),
        description: formData.description,
        is3d: formData.is3d,
        price: formData.price,
        discount: formData.discount,
        category: formData.category,
        type: formData.type,
        tags: tags,
        date: new Date(formData.date),
        userId: currentUser.uid ?? "anonymous", // Ensure userId is set to a default value if currentUser is null,
      };

      // Conditionally add 3D specific properties

      if (formData.type === "shaders") {
        docData = {
          ...docData,
          images: await uploadImages(formData.images),
        };
      }
      if (formData.type === "textures") {
        const maps = [
          "ambientOcclusion",
          "baseColor",
          "displacement",
          "normal",
          "roughness",
          "metallic",
          "bump",
          "idmap",
        ];

        const texturePromises = maps.map(async (map) => {
          const url = await uploadFile(formData[map]);
          return { [map]: url };
        });

        const textureResults = await Promise.all(texturePromises);

        const textureResultsObject = textureResults.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        docData = {
          ...docData,
          maps: textureResultsObject,
        };
      }

      if (formData.type === "models") {
        docData = {
          ...docData,
          model: await uploadFile(formData.model),
          resolution: formData.resolution,
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

      if (formData.type === "scripts") {
        docData = {
          ...docData,
          script: await uploadFile(formData.script),
          scriptName: formData.script && formData.script.name,
          scriptSize: formData.scriptSize,
        };
      }

      if (formData.type === "hdris") {
        docData = {
          ...docData,
          hdri: await uploadFile(formData.hdri),
          hdriSize: formData.hdriSize,
        };
      }

      if (formData.type === "printables") {
        docData = {
          ...docData,
          model: await uploadFile(formData.model),
          vertices: formData.vertices,
          volume: formData.volume,
          physicalSize: formData.physicalSize,
          resolution: formData.resolution,
          surfaceArea: formData.surfaceArea,
          layerHeight: formData.layerHeight,
          infillPercentage: formData.infillPercentage,
          printTimeEstimate: formData.printTimeEstimate,
          material: formData.material,
          nozzleSize: formData.nozzleSize,
          watertight: formData.watertight,
          manifold: formData.manifold,
          supportsRequired: formData.supportsRequired,
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

      setLoadingState("success");
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
            {loadingState && (
              <div className="uploading_overlay">
                <div
                  className={`spinner ${
                    loadingState == "success" ? "success" : ""
                  }`}
                >
                  {loadingState == "success" && (
                    <i className="icon fas fa-check"></i>
                  )}
                </div>
                <span>{loadingState}</span>
              </div>
            )}
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
                        <div className="thumbnail_preview">
                          <img
                            className="image"
                            src={URL.createObjectURL(formData.thumbnail)}
                            alt="thumbnail"
                          />
                          <span className="file_name">
                            {formData.thumbnail.name}
                          </span>
                        </div>
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
                </div>

                <div className="right">
                  <DescriptionBox
                    description={formData.description}
                    handleChange={handleChange}
                  />
                  <select name="type" onChange={handleChange} required>
                    <option value="" disabled selected>
                      Select Asset type
                    </option>
                    <option value="models">Model</option>
                    <option value="printables">Printable</option>
                    <option value="textures">Texture</option>
                    <option value="sounds">Sound</option>
                    <option value="scripts">Script</option>
                    <option value="shaders">Shader</option>
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
                    maxLength={3}
                    max={999}
                    required
                  />
                  {formData.price && formData.price > 0 && (
                    <input
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="Discount"
                      type="number"
                      required
                    />
                  )}
                  <div className="tags_input">
                    {tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                    <input
                      name="tags"
                      value={formData.tags}
                      onChange={(event) => {
                        handleTagInputChange(event);
                      }}
                      placeholder="Tags (comma-separated)"
                      required
                    />
                  </div>
                  {formData.type === "models" ||
                  formData.type === "printables" ? (
                    <label>
                      <input
                        name="is3d"
                        type="checkbox"
                        checked={
                          formData.type === "models" ||
                          formData.type === "printables"
                            ? true
                            : formData.is3d
                        }
                        onChange={handleChange}
                      />{" "}
                      Is 3D
                    </label>
                  ) : null}
                  {
                    // if is 3d is false ask for images

                    formData.type === "shaders" ? (
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
                  {formData.type === "textures" ? (
                    <>
                      <label>
                        Ambinent Occlusion
                        <input
                          type="file"
                          name="ambientOcclusion"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              ambientOcclusion: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        Base Color
                        <input
                          type="file"
                          name="baseColor"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              baseColor: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        Displacement
                        <input
                          type="file"
                          name="displacement"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              displacement: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        Normal
                        <input
                          type="file"
                          name="normal"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              normal: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        Roughness
                        <input
                          type="file"
                          name="roughness"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              roughness: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        Metallic
                        <input
                          type="file"
                          name="metallic"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              metallic: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        Bump
                        <input
                          type="file"
                          name="bump"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              bump: e.target.files[0],
                            });
                          }}
                        />
                      </label>

                      <label>
                        IDMAP
                        <input
                          type="file"
                          name="idmap"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              idmap: e.target.files[0],
                            });
                          }}
                        />
                      </label>
                    </>
                  ) : null}
                  {(formData.type === "printables" ||
                    formData.type === "models") && (
                    <>
                      <label>Model </label>

                      <input
                        name="model"
                        id="fileInput"
                        type="file"
                        // supported formats
                        accept=".glb,.gltf,.stl,.obj,.fbx,.blend"
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
                        name="vertices"
                        type="number"
                        placeholder="Vertices"
                        onChange={handleChange}
                        required
                      />

                      <input
                        name="physicalSize"
                        type="text"
                        placeholder="Physical Size"
                        onChange={handleChange}
                        required
                      />
                      {formData.type === "models" && (
                        <>
                          <input
                            name="resolution"
                            type="text"
                            placeholder="Resolution"
                            onChange={handleChange}
                            required
                          />
                          <input
                            name="lods"
                            type="number"
                            placeholder="LODs"
                            onChange={handleChange}
                            required
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
                          </div>{" "}
                        </>
                      )}

                      {formData.type === "printables" && (
                        <>
                          <input
                            type="number"
                            name="volume"
                            value={formData.volume}
                            onChange={handleChange}
                            placeholder="Volume (cm³)"
                            required
                          />

                          <input
                            type="number"
                            name="surfaceArea"
                            value={formData.surfaceArea}
                            onChange={handleChange}
                            placeholder="Surface Area (cm²)"
                            required
                          />

                          {/* <label>
                            File Format:
                            <select
                              name="fileFormat"
                              value={formData.fileFormat}
                              onChange={handleChange}
                            >
                              <option value="STL">STL</option>
                              <option value="OBJ">OBJ</option>
                              <option value="AMF">AMF</option>
                            </select>
                          </label> */}

                          <input
                            type="number"
                            name="layerHeight"
                            value={formData.layerHeight}
                            onChange={handleChange}
                            placeholder="Layer Height (mm)"
                            required
                          />

                          <input
                            type="number"
                            name="infillPercentage"
                            value={formData.infillPercentage}
                            onChange={handleChange}
                            placeholder="Infill Percentage (%)"
                            required
                          />

                          <input
                            type="number"
                            name="printTimeEstimate"
                            value={formData.printTimeEstimate}
                            onChange={handleChange}
                            placeholder="Print Time Estimate (hours)"
                            required
                          />

                          <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            placeholder="Material"
                            required
                          />

                          <input
                            type="number"
                            name="nozzleSize"
                            value={formData.nozzleSize}
                            onChange={handleChange}
                            placeholder="Nozzle Size (mm)"
                            required
                          />

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <label>
                              Watertight:
                              <input
                                type="checkbox"
                                name="watertight"
                                checked={formData.watertight}
                                onChange={handleChange}
                                required
                              />
                            </label>

                            <label>
                              Manifold:
                              <input
                                type="checkbox"
                                name="manifold"
                                checked={formData.manifold}
                                onChange={handleChange}
                                required
                              />
                            </label>

                            <label>
                              Supports Required:
                              <input
                                type="checkbox"
                                name="supportsRequired"
                                checked={formData.supportsRequired}
                                onChange={handleChange}
                                required
                              />
                            </label>
                          </div>
                        </>
                      )}
                    </>
                  )}{" "}
                  {formData.type === "hdris" && (
                    <>
                      <input
                        name="hdri"
                        id="fileInput"
                        type="file"
                        accept=".hdr"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            hdri: e.target.files[0],
                            hdriSize: e.target.files[0].size,
                          });
                        }}
                        required
                      />

                      <label for="fileInput" className="custom-file-input">
                        Choose HDRI File
                      </label>
                    </>
                  )}
                  {formData.type === "scripts" ? (
                    <>
                      <input
                        name="script"
                        id="fileInput"
                        type="file"
                        // supported formats
                        accept=".js,.cs,.py,.lua,.cpp"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            script: e.target.files[0],
                            scriptSize: e.target.files[0].size,
                          });
                        }}
                        required
                      />

                      <label for="fileInput" className="custom-file-input">
                        Choose Script
                      </label>
                    </>
                  ) : (
                    ""
                  )}
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
