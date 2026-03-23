
import { useEffect ,useState} from 'react';

const InfiniteScroller = (fetchMoreData, responseData, totalCount, containerRef) => {
  const[count,setCount] = useState(10)
  useEffect(()=>{
    if(responseData?.length===10)
    setCount(10);
  },[responseData?.length])
  const handleScroll = () => {
    const container = containerRef.current;
    if (container && container.scrollTop + container.clientHeight >= container.scrollHeight) {
      console.log(responseData?.length);
      console.log(totalCount);
      
      if (responseData?.length < totalCount||count<totalCount) {
        fetchMoreData(`?limit=${10}&skip=${count}`);
        setCount(count+10);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    
    container?.addEventListener('scroll', handleScroll);
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [responseData, totalCount, fetchMoreData, containerRef]);
};

export default InfiniteScroller;
