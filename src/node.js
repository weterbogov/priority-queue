class Node {
	constructor(data, priority) {
		this.data = data;
		this.priority = priority;
		this.left = null;
		this.right = null;
		this.parent = null;
	}

	appendChild(node) {
		if (this.left == null) {
			node.parent = this;
			this.left = node;
		} else if (this.right == null) {
			node.parent = this;
			this.right = node;
		}
	}

	removeChild(node) {
		if (this.left === node) {
			this.left.parent = null;
			this.left = null;
		} else if (this.right == node) {
			this.right.parent = null;
			this.right = null;
		} else {
			throw new Error();
		}
	}

	remove() {
		if (this.parent != null) {
			this.parent.removeChild(this);
		}
	}

	swapWithParent() {
		if (this.parent != null) {
			var tempParent = this.parent;
			this.parent = this.parent.parent;
			tempParent.parent = this;
			if (this.parent != null) {
				if (this.parent.left == tempParent) {
					this.parent.left = this;
				} else {
					this.parent.right = this;
				}
			}

			if (this == tempParent.left) {
				var left = this.left;
				var right = this.right;
				this.left = tempParent;
				this.right = tempParent.right;
				if (this.right != null) {
					this.right.parent = this;
				}
				tempParent.left = left;
				if (tempParent.left != null) {
					tempParent.left.parent = tempParent;
				}
				tempParent.right = right;
				if (tempParent.right != null) {
					tempParent.right.parent = tempParent;
				}

			} else {
				var left = this.left;
				var right = this.right;
				this.left = tempParent.left;
				if (this.left != null) {
					this.left.parent = this;
				}
				this.right = tempParent;
				tempParent.left = left;
				if (tempParent.left != null) {
					tempParent.left.parent = tempParent;
				}
				tempParent.right = right;
				if (tempParent.right != null) {
					tempParent.right.parent = tempParent;
				}
			}

		}
	}
}

module.exports = Node;
