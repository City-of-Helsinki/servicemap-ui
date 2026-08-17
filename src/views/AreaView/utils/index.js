export const sortByOriginID = (districts) => {
  districts.sort(
    (a, b) =>
      Number.parseInt(a.origin_id, 10) - Number.parseInt(b.origin_id, 10)
  );
};

const exportedUtils = { sortByOriginID };

export default exportedUtils;
