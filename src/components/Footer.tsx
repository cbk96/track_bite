import React, { useContext } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full min-w-[320px] pt-[30px] relative bg-white border-[#ccc] border-t">
      <div className="mx-auto max-w-screen-sm px-5 lg:px-0 lg:w-[1020px] lg:max-w-[1020px] ">
        <div className="max-w-[1020px] h-[300px] lg:h-[200px] box-border flex">
          <p className="mr-3 text-[21px] text-[#afafaf] font-josefin font-bold">
            Track Bite
          </p>
          <div className="ml-10 text-[12px] text-[#666] font-bold">
            <p>주식회사 포트폴리오</p>
            <p className="flex flex-col font-normal lg:flex-row">
              <span>사업자번호 : 123-45-*****</span>
              <span className="hidden px-3 lg:inline">|</span>
              <span>대표 : 홍길동</span>
              <span className="hidden px-3 lg:inline">|</span>
              <span> 주소 : 경기도 **시 **구 **동 **로</span>
            </p>
            <p>
              <Link to="/admin">관리자 사이트로</Link>
            </p>
            <p className="mt-10 text-[16px]">대표전화 : 1777 - 7777</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
