import {
  fetchData,
  fetchDataWithImageUpload,
} from "../../helper/helperFunctions";
import { ProfilePic } from "../ProfilePic/ProfilePic";
import { Loading } from "../Loading/Loading";
import styles from "./UserProfileWrapper.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export function UserProfileWrapper() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userData, setUserData] = useState({});
  const { userId } = useParams();
  const [imageToUpload, setImageToUpload] = useState(null);
  const { isGuest } = useOutletContext();

  // currentStatus takes the following values: "editDescription"
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetchData(`home/user_profile/${userId}`, "GET");
        if (!response.ok) navigate("error");
        const fetchedData = await response.json();
        setUserData(fetchedData.matchingUser);
        setIsCurrentUser(fetchedData.isCurrentUserProfile);
      } catch (err) {
        if (err) navigate("error");
      }
    }

    fetchUserData();

    if (!isLoaded) setIsLoaded(true);
    if (isUpdatePending) setIsUpdatePending(false);
  }, [isUpdatePending, navigate, userId]);

  async function submitChange(data) {
    const endRoute =
      currentStatus === "editDescription" ? "change_description" : "";
    const fetchURL = `home/personal_profile/${endRoute}`;
    const dataToSubmit = JSON.stringify(data);

    try {
      const response = await fetchData(`${fetchURL}`, "PUT", dataToSubmit);
      if (!response.ok) navigate("error");

      setIsUpdatePending(true);
      setCurrentStatus("");
    } catch (err) {
      if (err) navigate("error");
    }
  }

  const cancelChangeButton = (
    <button onClick={() => setCurrentStatus("")}>Cancel</button>
  );
  const changeDescriptionButton =
    currentStatus === "editDescription" ? null : (
      <button onClick={() => setCurrentStatus("editDescription")}>
        Change description
      </button>
    );
  const changeDescriptionForm = (
    <>
      <form onSubmit={handleSubmit(submitChange)}>
        <input type="text" {...register("changeToSubmit")} />
        <input type="submit" />
      </form>
      {cancelChangeButton}
    </>
  );

  function selectImageToUpload(e) {
    setImageToUpload(e.target.files[0]);
  }

  async function uploadImage(e) {
    e.preventDefault();
    if (!imageToUpload) return;

    const data = new FormData();
    data.append("profilePic", imageToUpload);

    try {
      const response = await fetchDataWithImageUpload(
        `home/personal_profile/change_image`,
        "PUT",
        data,
      );
      if (!response.ok) navigate("error");
    } catch (err) {
      if (err) navigate("error");
    }
  }

  const changeImageForm = (
    <>
      <form method="PUT" encType="multipart/form-data" onSubmit={uploadImage}>
        <label>
          <p>Change image</p>
          <input
            className={styles.imageInput}
            type="file"
            name="profilePic"
            onChange={selectImageToUpload}
          />
        </label>
        {!imageToUpload ? null : (
          <input type="submit" disabled={!imageToUpload} />
        )}
      </form>
    </>
  );

  function logout() {
    navigate("/logout");
  }

  return !isLoaded ? (
    <Loading />
  ) : (
    <>
      <main className={styles.wrapper}>
        <h2>User Profile: {userData.username}</h2>

        <section className={styles.row}>
          <ProfilePic imgPath={userData.profilePicURL} />
          {isGuest ? (
            <p className={`${styles.preventEdit} ${styles.subText}`}>
              Guest users cannot edit profile picture
            </p>
          ) : (
            changeImageForm
          )}
        </section>

        <section className={styles.row}>
          <p>Description: {userData.description}</p>
          {isGuest ? (
            <p className={`${styles.preventEdit} ${styles.subText}`}>
              Guest users cannot edit description
            </p>
          ) : currentStatus === "editDescription" ? (
            changeDescriptionForm
          ) : isCurrentUser ? (
            changeDescriptionButton
          ) : null}
        </section>

        <section className={styles.row}>
          {isCurrentUser ? (
            <button
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          ) : null}
        </section>
      </main>
    </>
  );
}
