import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Building2, Heart, MessageSquare, Send } from "lucide-react";
import { memo } from "react";

const CommentItem = memo(function CommentItem({ comment, index }) {
	return (
		<motion.div
			className="flex gap-3"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
		>
			<Avatar className="h-9 w-9 flex-shrink-0 mt-1 border">
				{comment.avatar ? (
					<AvatarImage src={comment.avatar} alt={comment.user} />
				) : (
					<AvatarFallback
						className={`${
							comment.isOfficial
								? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
								: "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
						}`}
					>
						{comment.user.charAt(0).toUpperCase()}
					</AvatarFallback>
				)}
			</Avatar>
			<div className="flex-1 space-y-1.5">
				<div className="flex flex-wrap gap-2 justify-between items-center">
					<div className="flex items-center gap-2">
						<p className="font-medium">{comment.user}</p>
						{comment.isOfficial && (
							<Badge
								variant="outline"
								className="py-0 h-5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
							>
								<Building2 className="h-3 w-3 mr-1" />
								Official
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground">{comment.date}</p>
				</div>
				<div className="bg-muted/40 dark:bg-muted/10 p-3 rounded-lg border border-border/50">
					<p className="text-sm">{comment.text}</p>
				</div>
				<div className="flex items-center gap-4 pt-0.5">
					<button
						type="button"
						className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
						aria-label="Like comment"
					>
						<Heart className="h-3 w-3" />
						<span>Like</span>
					</button>
					<button
						type="button"
						className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
						aria-label="Reply to comment"
					>
						<MessageSquare className="h-3 w-3" />
						<span>Reply</span>
					</button>
				</div>
			</div>
		</motion.div>
	);
});

export function CommentSection({ comments, comment, setComment, onSubmit }) {
	return (
		<div className="space-y-5">
			{comments.length > 0 ? (
				<div className="space-y-5 mb-6">
					{comments.map((comment, index) => (
						<CommentItem key={index} comment={comment} index={index} />
					))}
				</div>
			) : (
				<div className="text-center py-8">
					<MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground">Belum ada komentar</p>
					<p className="text-sm text-muted-foreground/70 mt-1">
						Jadilah yang pertama memberikan komentar
					</p>
				</div>
			)}

			<Separator className="my-6" />

			<form onSubmit={onSubmit} className="space-y-4">
				<div className="flex items-start gap-3">
					<Avatar className="h-9 w-9 mt-1 border">
						<AvatarFallback className="bg-primary/10 text-primary">
							U
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-3">
						<div className="relative">
							<Textarea
								placeholder="Tulis komentar Anda..."
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="resize-none pr-12 min-h-24 bg-muted/30"
							/>
							<Button
								type="submit"
								size="icon"
								disabled={!comment.trim()}
								className="absolute bottom-2 right-2 h-8 w-8 rounded-full"
							>
								<Send className="h-4 w-4" />
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Komentar akan terlihat oleh semua orang. Harap jaga kesopanan.
						</p>
					</div>
				</div>
			</form>
		</div>
	);
}
