import {useEffect, useState} from 'react';
import axios from 'axios';


// Custom Hook which accepts the info data to be loaded and the page number
// It returns the data returned via API calls.
// After each scroll the pagenumber changes and thext batch of data is sent.
function useSearch(query,page) {

    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    // hasMore is used to check if we have run out of the available results.
    const [hasMore,setHasMore]=useState(true);
    const [displayList,setDisplayList]=useState([]);
    const CNT_PER_PAGE=8;

    // If query changes, it implies a new search has occoured which means that new data has to be rendered from page 1
    useEffect(()=>{
        setDisplayList([]);
        setHasMore(true);
    },[query]);
    

    useEffect(()=>{
        setLoading(true);
        setError(false);
        try{
            const getData=async()=>{

                const res=await Promise.all(query.slice(CNT_PER_PAGE*(page-1),CNT_PER_PAGE*page).map(async(val)=>{
                    const data=(await axios.get(val.url)).data;
                    return {name:data.name,img:data.sprites.front_default};
                }));
                setDisplayList(arr=>([...arr,...res]));
                
                if((page*CNT_PER_PAGE)>=query.length)setHasMore(false);
                setLoading(false);
            }
            getData();
        }
        catch(err){
            setError(true);
        }
    },[query,page]);
    return {loading,error,displayList,hasMore};
}

export default useSearch;