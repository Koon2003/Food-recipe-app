import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [recipeList, setRecipeList] = useState([]);
    const [recipeDetailsData, setRecipeDetailsData] = useState(null);
    const [favoritesList, setFavoritesList] = useState([]);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${search}`);
            const data = await response.json();

            if(data?.data?.recipes) {
                setRecipeList(data?.data?.recipes);
                setLoading(false);
                setSearch("");
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            setSearch("");
            setLoading(false);
        }
    }

    function handleAddToFavorites(currentItem) {
        const cpyFavoritesList = [...favoritesList];
        const index = cpyFavoritesList.findIndex((item) => item.id === currentItem.id);
        if(index === -1) {
            cpyFavoritesList.push(currentItem);
        } else {
            cpyFavoritesList.splice(index);
        }

        setFavoritesList(cpyFavoritesList);
    }

    return (
        <GlobalContext.Provider
            value={{
                search,
                setSearch,
                loading,
                recipeList,
                handleSubmit,
                recipeDetailsData,
                setRecipeDetailsData,
                handleAddToFavorites,
                favoritesList
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}