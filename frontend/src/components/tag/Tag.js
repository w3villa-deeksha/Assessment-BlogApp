const Tag = ({ name }) => {
  return (
    <div
      style={{
        backgroundColor: "#eee",
        padding: "0.6rem 1rem",
        borderRadius: "1rem",
        marginInline: "0.2rem",
      }}
      className="tag"
    >
      {name}
    </div>
  );
};

export default Tag;
