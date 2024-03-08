export const Toolbox = () => {

    return (
        <aside className="h-full w-[5%] relative ">
            <div className="h-full flex justify-center bg-[#457B9D]">
                <ul className="space-x-6 pt-6">
                    <li className="inline-block mx-6 pb-6">
                        <label title="Adicionar Novo Arquivo" htmlFor="fileInput" className="text-[#F1FAEE] cursor-pointer">
                            <i className="fa fa-plus fa-xl"></i>
                        </label>
                        <input type="file" id="fileInput" accept=".dcm" multiple></input>
                    </li>
                    <li className="inline-block pb-6">
                        <button title='Mover' id="move" className="text-[#F1FAEE]" disabled>
                            <i className="fa-solid fa-arrows-up-down-left-right fa-xl"></i>
                        </button>
                    </li>
                    <li className="inline-block pb-6">
                        <button title="Contraste" id="contrast" className="text-[#F1FAEE]">
                            <i className="fa-solid fa-circle-half-stroke fa-xl"></i>
                        </button>
                    </li>
                    <li className="inline-block pb-6">
                        <button title="Zoom" id="zoom" className="text-[#F1FAEE]">
                            <i className="fa-solid fa-magnifying-glass-plus fa-xl"></i>
                        </button>
                    </li>
                    <li className="inline-block pb-6">
                        <button title="Rotacionar" id="rotate" className="text-[#F1FAEE]">
                            <i className="fa-solid fa-rotate fa-xl"></i>
                        </button>
                    </li>
                    <li className="inline-block pb-6">
                        <button title="Salvar" id="save" className="text-[#F1FAEE]" disabled>
                            <i className="fa-solid fa-save fa-xl"></i>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="absolute bottom-0 right-0 mb-4 mr-5">
                <button title="Cancelar" id="cancel" className="text-[#F1FAEE] cursor-pointer">
                    <i className="fa-solid fa-cancel fa-xl"></i>
                </button>
            </div>
        </aside>
    )
}