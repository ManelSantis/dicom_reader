import { ImagesCarousel } from "./EditorComponents/ImagesCarousel";
import { Title } from "./EditorComponents/Title";

export const Editor = () => {

    return (
        <div className="w-[65%] h-full ">
            <Title />
            <div className="w-full h-[60%] items-center bg-black" onContextMenu={() => false}>
                <div id="dicomImage" className="w-full h-full bg-black"> </div>
            </div>
            <ImagesCarousel />
        </div>
    )
}