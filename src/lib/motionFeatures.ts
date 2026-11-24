// Animation features for <LazyMotion>, loaded as a separate chunk so the initial bundle stays small.
// domMax (not domAnimation) because the sliding tab indicators use `layoutId`.
import { domMax } from 'framer-motion'

export default domMax
