import { Link } from 'react-router-dom';
import { ShowAnnotationsTable } from './AnnotationsComponents/ShowAnnotationsTable.jsx';

export const Annotations = () => {

    return (
        <aside className="h-full w-[20%] flex flex-col">
            <div className="flex-1 w-full overflow-y-auto bg-[#457B9D] pt-6">
                <div className="w-full flex flex-col justify-center items-center pb-6">
                    <h1 className="text-[#F1FAEE] text-[32px] font-bold">Anotações</h1>
                </div>

                <div className="w-full flex flex-col justify-center items-center pb-6">
                    <select id="typeSpecie" className="bg-[#F1FAEE] text-[#2C536B] text-center w-[80%] rounded-md border-[#A8DADC]" name="specie">
                        <option value="default">Selecione Anotação</option>
                        <option value="ossos">Osso</option>
                        <option value="pele">Pele</option>
                        <option value="orgao">Órgão</option>
                        <option value="perigo">Perigo</option>
                    </select>
                </div>
                <div className="w-full flex flex-col justify-center items-center p-4 space-y-4">
                    <h1 className="text-[#F1FAEE] text-[24px] font-bold">Exibir Anotações</h1>
                    <ShowAnnotationsTable />
                </div>

                <div className="w-full flex flex-col bg-[#457B9D] text-[#F1FAEE] font-[600] p-4 space-y-4">
                    <label title="Adicionar Novo Arquivo" htmlFor="fileInput" className="w-full flex items-center hover:bg-[#7db0cf] cursor-pointer p-2 rounded">
                        <i className="fa fa-folder-open fa-xl mr-2"></i> Adicionar Novo Arquivo
                    </label>
                    <input type="file" id="fileInput" accept=".dcm" multiple className="hidden"></input>
                    <div className="flex flex-col space-y-4">
                        <button title="Salvar" id="save" className="w-full text-[#F1FAEE] bg-[#457B9D] hover:bg-[#7db0cf] p-2 rounded disabled:opacity-50" disabled>
                            <i className="fa-solid fa-save fa-xl mr-2"></i> Salvar Arquivo
                        </button>
                        <Link to="" className="w-full">
                            <button
                                title="Cancelar"
                                id="cancel"
                                className="w-full text-[#F1FAEE] bg-[#457B9D] hover:bg-[#7db0cf] p-2 rounded cursor-pointer"
                            >
                                <i className="fa-solid fa-cancel fa-xl mr-2"></i> Cancelar
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    )
}