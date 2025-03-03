const RatingStarts = ({ rating }) => {
  const starts = [];
  for (let i = 1; i <= 5; i++) {
      starts.push(
          <span 
              key={i} 
              className={`ri-star${i <= rating ? '-fill' : '-line'} text-yellow-500`} 
          />
      );
  }
  return <div className="flex">{starts}</div>;
};

export default RatingStarts;
