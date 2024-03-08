import { CheckBox } from "./CheckBox";

export const ShowAnnotationsTable = () => {

    return (
        <table className="w-full text-center">
            <tbody>
                <tr id="line1" className="text-[#F1FAEE] font-bold w-12">
                    <td className="px-6"> Ossos </td>
                    <td className="px-6"> Pele </td>
                    <td className="px-6"> Órgão </td>
                    <td className="px-6"> Perigo </td>
                </tr>
                <tr id="box1" className="text-[#F1FAEE] w-12 pt-4">
                    <td> <CheckBox id="osso" /> </td>
                    <td> <CheckBox id="pele" /> </td>
                    <td> <CheckBox id="orgao" /> </td>
                    <td> <CheckBox id="perigo" /> </td>
                </tr>
            </tbody>
        </table>
    )
}