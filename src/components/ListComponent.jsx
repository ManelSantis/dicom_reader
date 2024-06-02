import { Link } from 'react-router-dom';
export const ListComponent = ({ id, name, date, countImages, local, animal }) => {
    return (
        <tr className="border-b border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-[#F1FAEE] bg-[#2C536B]">
                {id}
            </th>
            <td className="px-6 py-4 bg-[#EDF8E9]">
                <Link to={`/${animal}/${id}`}>{name}</Link>
            </td>
            <td className="px-6 py-4 bg-[#2C536B] text-[#F1FAEE]">
                {local}
            </td>
            <td className="px-6 py-4 bg-[#EDF8E9]">
                {date}
            </td>
            <td className="px-6 py-4 bg-[#2C536B] text-[#F1FAEE]">
                {countImages}
            </td>
        </tr>
    )
}