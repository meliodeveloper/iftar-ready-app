import { motion } from "framer-motion";
import AvatarButton from "./AvatarButton";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-14 pb-3 px-5 flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-gold">{title}</h1>
        {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <AvatarButton />
    </motion.div>
  );
}
