import { Title } from "./EditorComponents/Title";

export const Editor = ({ handleSaveClick }) => {
    return (
        <>
            <Title handleSave={handleSaveClick} />
            <div className="w-full h-[75%] flex items-center justify-center bg-black" onContextMenu={() => false}>
                <div id="dicomImage" className="w-full h-full bg-black"></div>
            </div>
        </>
    );
};
