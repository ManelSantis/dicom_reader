import { Link } from 'react-router-dom';
export const ListComponent = ({ id, name, date, countImages, local, animal }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '00/00/0000';

        const dateObj = new Date(dateString);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();

        return `${day}/${month}/${year}`;
    };

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
                {formatDate(date)}
            </td>
            <td className="px-6 py-4 bg-[#2C536B] text-[#F1FAEE]">
                {countImages}
            </td>
        </tr>
    )
}