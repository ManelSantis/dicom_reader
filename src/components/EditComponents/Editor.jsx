import { ImagesCarousel } from "./EditorComponents/ImagesCarousel";
import { Title } from "./EditorComponents/Title";

export const Editor = () => {

    return (
        <div className="w-[65%] h-full ">
            <Title />
            <div id="dicom" className="w-full h-[60%] bg-black">
            </div>
            <ImagesCarousel />
        </div>
    )
}