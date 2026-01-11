"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  getUserLikesList,
  toggleFavorite,
} from "@/app/lib/features/properties/propertySlice";
import Link from "next/link";
import { Alert, Card, Skeleton, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation";

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isLoading: userLoading,
    hasCheckedAuth,
  } = useAppSelector((state) => state.user);
  const { data: userLikesList, loading: userLikesListLoading } = useAppSelector(
    (state) => state.property.likedList
  );

  useEffect(() => {
    if (!hasCheckedAuth || userLoading) return;

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    dispatch(getUserLikesList());
  }, [user, userLoading, hasCheckedAuth, dispatch, router, pathname]);

  if (!hasCheckedAuth || userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="h-screen px-4 sm:px-10 space-y-6">
      <p className="font-semibold sm:text-xl">My Favorites</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-4">
        {userLikesList.map((property: any) => (
          <Link href={`/properties/${property.id}`} key={property.id}>
            <Card
              className="rounded-xl !shadow-none hover:shadow-md transition-all"
              variant="borderless"
              cover={
                <div className="relative w-full h-[160px] sm:h-[200px]">
                  <img
                    className="w-full h-full object-cover rounded-xl"
                    alt={property.title}
                    src={property.image_url}
                  />
                  {user && (
                    <div
                      className={`absolute top-2 right-2 action-button-detail like-button ${
                        property.liked ? "liked" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(toggleFavorite(property.id));
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill={property.liked ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icon-tabler-heart transition-transform duration-150"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                      </svg>
                    </div>
                  )}
                </div>
              }
            >
              <div className="ml-[-22]">
                <h3 className="text-[.80rem] sm:text-[.75rem] font-semibold truncate">
                  {property.category} in {property.location}
                </h3>

                <p className="text-[.80rem] sm:text-[.75rem] text-gray-500">
                  ₱
                  {Number(property.price_per_night).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}{" "}
                  / night
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
