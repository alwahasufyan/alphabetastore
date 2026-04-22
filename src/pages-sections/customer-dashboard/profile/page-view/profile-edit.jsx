"use client";

import { Fragment, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// LOCAL CUSTOM COMPONENT
import ProfileEditForm from "../edit-form";
import ProfilePicUpload from "../profile-pic-upload";
import DashboardHeader from "../../dashboard-header";
import { fetchMyProfile } from "utils/users";


// ===========================================================


// ===========================================================

export function ProfileEditPageView({
  profileId
}) {
  const [user, setUser] = useState(null);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setPageError("");
        const profile = await fetchMyProfile();

        if (!cancelled) {
          setUser(profile);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load profile.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return <Fragment>
      <DashboardHeader href="/profile" title="Edit Profile" />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && user ? <Card sx={{
      padding: {
        xs: 3,
        sm: 4
      }
    }}>
          <ProfilePicUpload image="" name={user.name} />
          <ProfileEditForm user={user} onSaved={setUser} />
        </Card> : null}
    </Fragment>;
}