# Scalar Field Visualization


APP: https://cacilie.github.io/scalar-field-visualizer/

The objective of this project is to help visualize a scalar field in 2 Dimensions. While learning computer graphics, I had some trouble trying to visualize what a scalar field is and how it is used in different algorithms. This project does not explain the marching squares algorithm, but it helps with the visualization of a scalar field.

A Cartesian plane is defined with its four quadrants, as we will draw the geometry centered on the Cartesian plane's origin.

1. **Click on the Clear button.**
   Observe the empty Cartesian plane where the axes go from -1 to 1, with small steps of 0.1. We will refer to each of the defined units for all possible coordinates in the Cartesian plane as a "point."

2. **Click on Draw points.**
   For each point, we will calculate a value. Find the definition of the function on the control panel (the panel to the left of the plot). The application of this function to every point in the plane defines the scalar field.

3. **Click Draw contour.**
   A line is drawn to join all points with the same distance value. This distance value is called the ISO VALUE and, for this example, is defined as 0.8.

4. **Click on Marching squares.**
   The marching squares algorithm is implemented to provide a smooth contour. Please refer to this for more information on marching squares: [Wikipedia: Marching Squares](https://en.wikipedia.org/wiki/Marching_squares)
