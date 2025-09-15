const formatPlagiarismScore = (score) => {
  return Math.round(score * 100) + '%';
};

module.exports = { formatPlagiarismScore };
