import React from "react";
import styles from "../css/Videos.module.css";

const videoData = [
    {
        id: 1,
        type: "youtube",
        src: "https://www.youtube.com/embed/CyxNdfv0YQA",
        classes: `${styles.card} ${styles.w4}`,
        title: "Video 1",
    },
    {
        id: 2,
        type: "youtube",
        src: "https://www.youtube.com/embed/RKK7wGAYP6k",
        classes: `${styles.card} ${styles.w2} ${styles.h2}`,
        title: "Video 2",
    },
    {
        id: 3,
        type: "youtube",
        src: "https://www.youtube.com/embed/F4Zu5ZZAG7I",
        classes: `${styles.card} ${styles.w2}`,
        title: "Video 3",
    },
    {
        id: 4,
        type: "youtube",
        src: "https://www.youtube.com/embed/2Vv-BfVoq4g",
        classes: styles.card,
        title: "Video 4",
    },
    {
        id: 5,
        type: "youtube",
        src: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
        classes: styles.card,
        title: "Video 5",
    },
    {
        id: 6,
        type: "local",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        classes: `${styles.card} ${styles.w3}`,
        title: "Local Video",
    },
];

const Videos = () => {
    return (
        <div className={styles.container}>
            {/* <h1 className={styles.heading}>Videos Page</h1> */}

            <div className={styles.grid}>
                {videoData.map((video) => (
                    <div key={video.id} className={video.classes}>
                        {video.type === "youtube" ? (
                            <iframe
                                src={video.src}
                                title={video.title}
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video controls src={video.src}></video>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Videos;



<iframe width="1264" height="711" src="" title="7 Ways to Make a Conversation With Anyone | Malavika Varadan | TEDxBITSPilaniDubai" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>