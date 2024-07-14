const Search = ({searchString, handleSearchChange}) => {
    return(
        <div>
            search: <input value={searchString} onChange={handleSearchChange}/>
        </div>
    )
}
export default Search