// Import React so we can define a functional component
import React from "react";

// Import Pagination UI component from react-bootstrap (pre-styled)
import Pagination from "react-bootstrap/Pagination";

/**
 * Simple Pagination component that shows all page numbers (1, 2, 3, ...)
 * and Prev / Next buttons.
 *
 * Props:
 * - totalCount: total number of items (from backend, e.g. "count")
 * - page: current active page number
 * - pageSize: number of items per page (default 8)
 * - onChange(newPage): function called when user selects a different page
 * - disabled: disables all buttons (e.g., while loading)
 * - className: optional CSS classes
 */
export default function PaginationSimple({
  totalCount,
  page,
  pageSize = 8,
  onChange,
  disabled = false,
  className = "",
}) {
  // Calculate how many total pages are needed.
  // Example: 16 items / 8 per page = 2 pages
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));

  // If there's only 1 page, don't render the pagination bar at all
  if (totalPages <= 1) return null;

  /**
   * Helper function to handle navigation to another page.
   * - Ignores invalid or duplicate clicks (e.g. clicking current page).
   */
  const go = (p) => {
    // If pagination is disabled (loading state), ignore clicks
    if (disabled) return;

    // Only trigger change if target page is valid and not current
    if (p >= 1 && p <= totalPages && p !== page) onChange(p);
  };

  // Array to hold all the <Pagination.Item> elements
  const items = [];

  // Add the "Previous" button at the beginning
  items.push(
    <Pagination.Prev
      key="prev" // Unique key for React list rendering
      disabled={page === 1 || disabled} // Disable if already on first page or loading
      onClick={() => go(page - 1)} // Go to previous page when clicked
    />
  );

  // Loop from 1 to totalPages and create a button for each page
  for (let i = 1; i <= totalPages; i++) {
    items.push(
      <Pagination.Item
        key={i} // Each page button needs a unique key
        active={i === page} // Highlight current active page
        disabled={disabled || i === page} // Disable click on current or while loading
        onClick={() => go(i)} // Go to selected page when clicked
      >
        {i} {/* Display page number text */}
      </Pagination.Item>
    );
  }

  // Add the "Next" button at the end
  items.push(
    <Pagination.Next
      key="next" // Unique key
      disabled={page === totalPages || disabled} // Disable if already at last page
      onClick={() => go(page + 1)} // Go to next page when clicked
    />
  );

  // Finally, render the Pagination bar with all items
  return (
    <Pagination className={className}>
      {items} {/* Insert the array of Prev, numbered pages, and Next */}
    </Pagination>
  );
}
