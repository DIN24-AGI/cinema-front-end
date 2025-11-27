interface Movie {
  id: number;
  title: string;
  banner: string;
}

const ComingSoonSection: React.FC<{ movies: Movie[] }> = ({ movies }) => {
  return (
    <section className="mb-5">
      <h2 className="mb-3 fw-bold">Coming Soon</h2>

      <div className="row g-4">
        {movies.map((m) => (
          <div key={m.id} className="col-md-6">
            <div className="card shadow">
              <img src={m.banner} className="card-img-top" alt={m.title} />
              <div className="card-body">
                <h5 className="card-title">{m.title}</h5>
              </div>
                              <div className="mt-auto d-flex gap-2">
                  <button
                    className="btn btn-outline-primary flex-fill"
                    onClick={() => alert('This will nagivate to movie details')}
                  >
                    Details
                  </button>
                  </div>

            </div>
          </div>
          
        ))}
      </div>
    </section>
  );
};

export default ComingSoonSection;
