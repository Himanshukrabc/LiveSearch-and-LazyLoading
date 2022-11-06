import './Tile.css';

function Tile({name,img,idNum,Fref}){
  // console.log(Fref);
  return (
    <div className="tile-container" ref={Fref} id={`${idNum}`}>
        <img src={img} alt={name} className="tile-img"/>
        <div className="name">{name}</div>
    </div>
  )
}

export default Tile;