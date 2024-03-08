import { ShowAnnotationsTable } from './AnnotationsComponents/ShowAnnotationsTable.jsx'

export const Annotations = () => {

    return (
        <aside className="h-full w-[30%] flex flex-col justify-center items-center">
            <div className="h-full w-full overflow-y-auto bg-[#457B9D] pt-6">
                <div className="w-full flex flex-col justify-center items-center pb-6">
                    <h1 className="text-[#F1FAEE] text-[40px] text-bold">Anotações</h1>
                </div>
                <div className="w-full flex flex-col justify-center items-center pb-6">
                    <select className="bg-[#F1FAEE] text-[#2C536B] text-center w-[80%] rounded-md border-[#A8DADC]" name="specie" id="type">
                        <option value="">Selecione o Tipo de Anotação</option>
                        <option value="ossos">Ossos</option>
                        <option value="pele">Pele</option>
                        <option value="orgao">Órgão</option>
                        <option value="perigo">Perigo</option>
                    </select>
                </div>
                <div className="w-full flex flex-col justify-center items-center pb-6">
                    <h1 className="text-[#F1FAEE] text-[24px] text-bold">Exibir Anotações</h1>
                    <ShowAnnotationsTable />
                </div>

            </div>
        </aside>
    )
}