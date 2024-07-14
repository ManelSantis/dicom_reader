import { CheckBox } from "./CheckBox";

export const ShowAnnotationsTable = () => {

    return (
        <>
            <div className="grid grid-cols-2 gap-4 text-[#F1FAEE] font-[600] mt-6">
                <div className="flex items-center">
                    <CheckBox id="osso" /> <span className="ml-2">Osso</span>
                </div>
                <div className="flex items-center">
                    <CheckBox id="pele" /> <span className="ml-2">Pele</span>
                </div>
                <div className="flex items-center">
                    <CheckBox id="orgao" /> <span className="ml-2">Órgão</span>
                </div>
                <div className="flex items-center">
                    <CheckBox id="perigo" /> <span className="ml-2">Perigo</span>
                </div>
            </div>
        </>
    )
}