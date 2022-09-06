import PortalItem from "@arcgis/core/portal/PortalItem";
import "./Gallery.css";

interface GalleryProps {
  items: PortalItem[];
}

export default function Gallery({ items }: GalleryProps) {
  return (
    <div id="itemGallery">
      {items.map((item) => (
        <div className="esri-item-container" key={item.id}>
          {item.thumbnailUrl ? (
            <div
              className="esri-image"
              style={{
                backgroundImage: `url(${item.thumbnailUrl})`,
              }}
            ></div>
          ) : (
            <div className="esri-image esri-null-image">
              Thumbnail not available
            </div>
          )}

          {item.title ? (
            <div className="esri-title">{item.title || ""}</div>
          ) : (
            <div className="esri-title esri-null-title">
              Title not available
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
