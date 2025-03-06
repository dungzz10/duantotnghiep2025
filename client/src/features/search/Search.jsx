import React, { useState } from "react";
import { useAllProducts } from "../product/useProducts";
import SearchWrapper from "./SearchWrapper";
import { useUser } from "../../app/hook/LoadUser";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setsearchParam] = useSearchParams();

  const q = searchParams.get("q");
  const { user, isLoading: loading } = useUser();
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useAllProducts({ limit: 12, query: q });
  // console.log(data)
  const res = data?.pages[0]
  console.log("res",res)

  console.log(q);
  if (isLoading) return <p> loading ....</p>;
  if (isError) return <div>Lỗi khi tải sản phẩm!</div>;
  if (loading) return <p>loading ....</p>;
  return (
    <>
      <div>Search</div>
      <SearchWrapper
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isError={isError}
        isLoading={isLoading}
        q={q}
        setsearchParam={setsearchParam}
      ></SearchWrapper>
    </>
  );
};

export default Search;
