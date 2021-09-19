module.exports.advancesResult = async (Data, perPage) => {
  const { page } = req.query;
  const startPage = (page - 1) * perPage;
  const endPage = page * perPage;
  const result = await Data.find().skip(startPage).limit(endPage);
	res.status(200).json({
		status: "success",
		data: result,
	});
};
