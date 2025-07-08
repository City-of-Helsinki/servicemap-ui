export const sortByOriginID = (districts) => {
  districts.sort(
    (a, b) => parseInt(a.origin_id, 10) - parseInt(b.origin_id, 10)
  );
};

const exportedUtils = { sortByOriginID };

export default exportedUtils;
