/**
 * USAGE EXAMPLES - Table to Card Conversion
 * 
 * There are 3 ways to make tables responsive with card view on mobile:
 * 
 * 1. OPTION 1: Automatic CSS Conversion (easiest)
 *    - Use standard Bootstrap tables
 *    - CSS automatically converts them to cards on mobile
 *    - No component changes needed
 * 
 * 2. OPTION 2: ResponsiveTable Component (recommended)
 *    - Components automatically switch between table/card view
 *    - Better control over column definitions
 *    - Cleaner code
 * 
 * 3. OPTION 3: DataCard Component (for custom layouts)
 *    - Use when you need full control over card layout
 *    - Better for complex data structures
 * 
 * ============================================================
 * OPTION 1: AUTOMATIC CSS CONVERSION (Simplest)
 * ============================================================
 * 
 * Just use standard Bootstrap tables - CSS will automatically 
 * convert them to cards on mobile!
 * 
 * Example:
 * 
 * <div className="table-responsive">
 *   <table className="table table-hover">
 *     <thead className="table-dark">
 *       <tr>
 *         <th>#</th>
 *         <th>Name</th>
 *         <th>Email</th>
 *         <th>Actions</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {students.map((student, i) => (
 *         <tr key={student._id}>
 *           <td>{i + 1}</td>
 *           <td>{student.name}</td>
 *           <td>{student.email}</td>
 *           <td>
 *             <button className="btn btn-sm btn-primary me-2">Edit</button>
 *           </td>
 *         </tr>
 *       ))}
 *     </tbody>
 *   </table>
 * </div>
 * 
 * ============================================================
 * OPTION 2: RESPONSIVE TABLE COMPONENT (Recommended)
 * ============================================================
 * 
 * import ResponsiveTable from "./common/ResponsiveTable";
 * 
 * const columns = [
 *   {
 *     key: "enrollmentNo",
 *     label: "Enrollment",
 *     width: "120px",
 *   },
 *   {
 *     key: "name",
 *     label: "Name",
 *   },
 *   {
 *     key: "course",
 *     label: "Course",
 *   },
 *   {
 *     key: "email",
 *     label: "Email",
 *     render: (value) => <a href={`mailto:${value}`}>{value}</a>,
 *   },
 * ];
 * 
 * <ResponsiveTable
 *   data={students}
 *   columns={columns}
 *   hover={true}
 *   variant="hover"
 *   emptyMessage="No students found"
 *   showActions={true}
 *   onEdit={(student) => console.log("Edit:", student)}
 *   onDelete={(id) => console.log("Delete:", id)}
 * />
 * 
 * ============================================================
 * OPTION 3: DATA CARD COMPONENT (Custom Layout)
 * ============================================================
 * 
 * import DataCard from "./common/DataCard";
 * 
 * const columns = [
 *   {
 *     key: "registrationNo",
 *     label: "Registration",
 *   },
 *   {
 *     key: "studentName",
 *     label: "Student Name",
 *   },
 *   {
 *     key: "totalMarks",
 *     label: "Total Marks",
 *     render: (value, row) => (
 *       <span className="badge bg-success">{value}%</span>
 *     ),
 *   },
 * ];
 * 
 * <DataCard
 *   data={results}
 *   columns={columns}
 *   emptyMessage="No results yet"
 * />
 * 
 * ============================================================
 * CSS FEATURES
 * ============================================================
 * 
 * The CSS automatically does the following on mobile (<768px):
 * 
 * ✓ Hides table headers
 * ✓ Converts each row to a card
 * ✓ Displays each cell as a row in the card
 * ✓ Shows column labels (from nth-child selectors)
 * ✓ Adjusts spacing and borders
 * ✓ Makes buttons full-width and stacked
 * ✓ Maintains all styling (colors, fonts, etc.)
 * 
 * No JavaScript needed - just pure CSS!
 * 
 * ============================================================
 * CUSTOMIZATION
 * ============================================================
 * 
 * Mobile Card Styling:
 * - .mobile-card : Main card container
 * - .mobile-card-row : Each data row in card
 * - .mobile-card-label : Column label
 * - .mobile-card-value : Data value
 * 
 * Modify in App.css for custom styling
 * 
 * ============================================================
 * COMPONENT PROPS
 * ============================================================
 * 
 * ResponsiveTable Props:
 * - data: Array of objects to display
 * - columns: Array of column definitions
 * - cardColumns: Optional separate card columns
 * - hover: Enable row hover effect
 * - variant: Bootstrap table variant
 * - emptyMessage: Message when no data
 * - showActions: Show action button column
 * - onEdit: Callback for edit button
 * - onDelete: Callback for delete button
 * 
 * DataCard Props:
 * - data: Array of objects to display
 * - columns: Array of column definitions
 * - emptyMessage: Message when no data
 * - onDelete: Delete handler function
 * - onEdit: Edit handler function
 * - showActions: Show action buttons
 * - maxVisible: Max items to show (pagination)
 * 
 * ============================================================
 */

// This file is for documentation only - no code to execute
