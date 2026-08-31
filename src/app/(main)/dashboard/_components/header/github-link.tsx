import Link from "next/link";

import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";

const REPOSITORY_URL = "https://github.com/rudawirocaltontshuma/crm_sales_platform";

export function GitHubLink() {
  return (
    <Button asChild size="icon" aria-label="View source on GitHub">
      <Link prefetch={false} href={REPOSITORY_URL} target="_blank" rel="noreferrer">
        <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
      </Link>
    </Button>
  );
}
