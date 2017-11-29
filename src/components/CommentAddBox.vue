<template>
  <form action="#" method="post">
				<fieldset>
					<input type="text" placeholder="Type your message…" autofocus>
					<input type="hidden">
				</fieldset>
	</form>
</template>

<script>
export default {
  name: 'comment-add-form'
}
</script>

<style scoped>
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}
form {
  padding: 24px;
}
input {
  border: 0;
  color: inherit;
  font-family: inherit;
  font-size: 100%;
  line-height: normal;
  margin: 0;
}
input[type="text"] {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
  outline: none;
  width: 274px;
}
</style>

